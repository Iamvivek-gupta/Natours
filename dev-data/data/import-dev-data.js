const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourmodels');

dotenv.config({ path : './config.env'})


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


//Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// importing json data in DB

const importData = async () =>{
    try{
     await Tour.create(tours);
     console.log('Data Imported Successfully');
    } catch(err){
         console.log(err);
    }
}

// deleting collection

const deleteData = async () =>{
    try{
     await Tour.deleteMany();
     console.log('Data Deleted Successfully');
    } catch(err){
         console.log(err);
    }
};


if(process.argv[2] === '--import'){
    importData();
} else{
    deleteData();
}
//console.log(process.argv);

