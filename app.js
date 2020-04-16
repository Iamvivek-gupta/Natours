const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

dotenv.config({ path: "./config.env" });
console.log(app.get('env'))

// connect Mongodb Compass

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    //console.log(con.connections);
    console.log("databas connected");
  })
  .catch((error) => {
    console.log(error);
  });

// 1) MIDDLEWARE
// if(process.env.NODE_ENV === 'development'){
//   app.use(morgan("dev"));
// }
app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTour );
// app.post('/api/v1/tours',createTour);
// app.post('/api/v1/tours/:id', getOneTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

// 3) ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `can't not find ${req.originalUrl} on this server!!`,
  //   });
//   const err = new Error(`can't not find ${req.originalUrl} on this server!!`);
//   (err.status = "fail"), (err.statusCode = 404);

  next(new AppError(`can't not find ${req.originalUrl} on this server!!`, 404));
});

// Global Error handling middleware
app.use(globalErrorHandler);

// 4) START SERVERS
const port = process.env.PORT || 800;

app.listen(port, () => {
  console.log(`App is running on Port ${port}...`);
});

//module.exports = app;

//console.log(process.env);
