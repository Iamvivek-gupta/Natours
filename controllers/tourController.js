const fs = require('fs');
const Tour = require('./../models/tourmodels')
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

exports.getAllTour = async (req, res) =>{
    try{
        const queryObj = {...req.query}
        const excludeField = ['page','limit','sort'];
        excludeField.forEach(el =>delete queryObj[el]);

        //console.log(req.query, queryObj);
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });
        // const tours = await Tour.find().
        // where('duration').equals(5).
        // where('difficulty').equals('easy')
        const tours = await Tour.find(queryObj);

        res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
    } catch(err){
        res.status(400).json({
        status: 'fail',
        message: err
    });
    }
}



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


exports.createTour = async (req, res) =>{
try{
    const newTour = await Tour.create({})
    res.status(201).json({
        status : 'success',
        data : {
            tours: newTour
        }
    });
} catch(err){
    res.status(400).json({
        status : 'fail',
        message : err
    })
}
    
}



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


exports.getOneTour = async (req, res) =>{
    _id = req.params.id;
    console.log(_id);
    try{
        //const tour = await Tour.findById(req.params.id);
        console.log(req.params.id)
        const tour = await Tour.findOne({_id: req.params.id});
        res.status(200).json({
            status: 'success',
            data: tour
        });
    } catch(err){
       res.status(400).json({
           status : 'fail',
           message : err
       })
    }
}




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

exports.updateTour = async (req,res) =>{
    try{
     tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
           new: true,
           runValidators: true
       })
     res.status(200).json({
         status: 'success',
        data: {
            tour
        }
     })  

    } catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        })
    }
}

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

exports.deleteTour = async (req,res) =>{
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
        status : "success",
        data : null
        });
    } catch(err){
        res.status(400).json({
            status : 'fail',
            message : err
        })
    }
}