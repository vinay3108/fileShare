require('dotenv').config();

const mongoose=require('mongoose');

function connectDB(){
    //Database Connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        console.log("DB Connected");
    })
    .catch((err)=>{
        console.log(err);
    })
   
}

module.exports=connectDB;