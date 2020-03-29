// 1) TourModel
const mongoose = require('mongoose');
const tourSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A Tour must have name']
        
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