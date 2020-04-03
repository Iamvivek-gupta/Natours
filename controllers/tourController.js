const fs = require("fs");
const Tour = require("../models/tourModels");
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//     );

// exports.getAllTour = (req, res) =>{
//     console.log(req.requestTime)
//     res.status(200).json({
//         status : 'success',
//         requestAt : req.requestTime,
//         result :  tours.length,
//         data : {
//             tours
//         }
//     });
//  }

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,ratingsAverage,price,difficulty,summary";
  next();
};

// class APIFeatures {
//      constructor(query, queryString){
//         this.query = query;
//         this.queryStr = queryString;
//      }

//      filter(){
//         const queryObj = { ...this.queryString }
//         const excludeField = ['page', 'limit', 'sort', 'fields'];
//         excludeField.forEach(el => delete queryObj[el]);

//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
//         this.query.find(JSON.parse(queryStr))

//         return this;
//      }

//      sort(){
//         if (this.queryString.sort) {
//             const sortBy = req.query.sort.split(',').join(' ');
//             // query = query.sort(req.query.sort);
//             this.query = this.query.sort(sortBy);
//             // sort('price ratingsAverage');
//         }
//         else {
//             this.query = this.query.sort('-createdAt');
//         }

//         return this;
//      }

//      limitFields(){
//         if (this.queryString.fields) {
//             const fields = this.queryString.fields.split(',').join(' ');
//             this.query = this.query.select(fields)
//         }
//         else {
//             this.query = this.query.select('-__v');
//         }

//         return this;
//      }

//      paginate(){
//         const page = this.queryString.page * 1 || 1;
//         const limit = this.queryString.limit * 1 || 100;
//         const skip = (page - 1) * limit;

//         this.query = this.query.skip(skip).limit(limit);
//         // if(this.queryString.page) {
//         //     const numTours = await Tour.countDocuments();
//         //     if(skip >= numTours) throw new Error('this page does not exist');
//         // }

//         return this;
//      }
// }

exports.getAllTour = async (req, res) => {
  try {
    //BUILD QUIRING
    //1A) Filtering
    const queryObj = { ...req.query };
    const excludeField = ["page", "limit", "sort", "fields"];
    excludeField.forEach(el => delete queryObj[el]);

    // console.log(req.query, queryObj);
    // const tours = await Tour.find({
    //     duration: 5,
    //     difficulty: 'easy'
    // });
    // const tours = await Tour.find().
    // where('duration').lt(5).
    // where('difficulty').equals('easy')

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    // JSON.parse(queryStr)

    // 2) SORTING
    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join( );
    //     console.log(sortBy)
    //     query = query.sort(sortBy);
    //

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // query = query.sort(req.query.sort);
      query = query.sort(sortBy);
      // sort('price ratingsAverage');
    } else {
      query = query.sort("-createdAt");
    }

    //3) Fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagintion
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("this page does not exist");
    }

    // EXECUTE THE QUERY

    const tours = await query;

    // SEND QUERY RESPONSE
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

// exports.createTour = (req, res) =>{
//     const newId = tours[tours.length-1].id + 1;
//     const newTour = Object.assign({ id : newId}, req.body);
//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
//         res.status(201).json({
//             status :'success',
//             data : {
//                 tours : newTour
//             }
//         })
//     })
// }

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({});
    res.status(201).json({
      status: "success",
      data: {
        tours: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

// exports.getOneTour = (req, res) =>{
//     console.log(req.params)
//     const id = req.params.id*1;
//     const tour = tours.find(el => el.id === id);
//     //if(id>tours.length){

//     if(!tour){
//         return res.status(400).json({
//             status : "fail",
//             message : "Invalid ID"
//         })
//     }

//     res.status(201).json({
//         status : "success",
//         data : {
//             tour
//         }
//     })
// }

exports.getOneTour = async (req, res) => {
  _id = req.params.id;
  console.log(_id);
  try {
    //const tour = await Tour.findById(req.params.id);
    console.log(req.params.id);
    const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

// exports.updateTour = (req,res) =>{
//     if(req.params.id*1>tours.length){
//         return res.status(404).json({
//             status : "fail",
//             message : "Invaild ID"
//         })
//     }

//     res.status(200).json({
//         status : "success",
//         data : {
//             tour : "<Updated Tour Here>"
//         }
//     })
// }

exports.updateTour = async (req, res) => {
  try {
    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

// exports.deleteTour = (req,res) =>{
//     if(req.params.id*1>tours.length){
//         return res.status(404).json({
//             status : "fail",
//             message : "Invaild ID"
//         })
//     }

//     res.status(204).json({
//         status : "success",
//         data : null
//     })
// }

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

// for aggregation pipeline

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { avgPrice: -1 }
      }
      //   {
      //       $match : { _id : { $ne: 'easy'}}
      //   }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month : '$startDates'},
                numToursStarts: { $sum: 1},
                tours: { $push: '$name'}
            }
        },
        {
            $addFields: { month: '$_id'}
        },
        {
            $project: { _id: 0}
        },
        {
            $sort: { numToursStarts: 1}
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};
