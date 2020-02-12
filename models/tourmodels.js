const mongoose = require('mongoose');

//) Tour models

const tourSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A Tour must have name'],
        unique : true
        
    },
    rating : {
        type : Number,
        default : 4.5
    },
    price : {
        type : Number,
        required : [true, 'A Tour must have price']
    }
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