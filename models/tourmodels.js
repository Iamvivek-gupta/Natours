const mongoose = require('mongoose');

//) Tour models

const tourSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A Tour must have name'],
        unique : true,
        trim : true
        },
    duration : {
        type : Number,
        required : [true, 'A Tour must have durations']
    },
    maxGroupSize : {
        type : Number,
        required : [true, 'A Tour must have group size']
    },    
    difficulty : {
        type : String,
        required : [true, 'A Tour must have difficulty']
    },
    ratingsAverage : {
        type : Number,
        default : 4.5
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : [true, 'A Tour must have price']
    },
    priceDiscount : Number,
    summary : {
        type : String,
        trim : true,
        required : [true, 'A Tour must have summary']
    },
    discription : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true, 'A Tour must cover image']
    },
    images : [String],
    createdAt : {
        type : Date,
        default : Date.now(),
        select : false
    },
    startDates : [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// const testTour = new Tour({
//     name : 'vivek',
//     price : 78
// })

// testTour.save().then((doc) =>{
//     console.log(doc)
// }).catch((err) =>{
//     console.log('wrong:', err)
// });