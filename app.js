const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

dotenv.config({ path : './config.env'})
console.log(process.env.DATABASE);
console.log(process.env.DATABASE_PASSWORD);


// connect Mongodb Compass

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology : true
}).then(con =>{
    //console.log(con.connections);
    console.log("databas connected")
}).catch(error =>{
    console.log(error);
});


// 1) MIDDLEWARE
app.use(morgan('dev'));

app.use(express.json());

app.use((req,res,next) =>{
    console.log('hallo from Middleware!!!!');
    next();
})


app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
})


// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTour );
// app.post('/api/v1/tours',createTour);
// app.post('/api/v1/tours/:id', getOneTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);


// 3) ROUTES






app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START SERVERS
 const port = process.env.PORT;

app.listen(port, () =>{
      console.log(`App is running on Port ${port}...`)
});

 //module.exports = app;

//console.log(process.env);