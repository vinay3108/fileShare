const express=require('express');
const path=require('path');
const router=express.Router();
const multer=require('multer');
const {v4:uuid4}=require('uuid')
const File=require('../models/file');

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
})
let upload=multer({
    storage,
    limits:{fileSize:1000000*100}
}).single('myfile');


router.post('/',(req,res)=>{

    
    
    //store fie
    upload(req,res,async(err)=>{
        
        //validate  request
        if(!req.file){
            return res.json({error:'All fields are required'});
        }
        if(err)
        {
            res.status(500).send({error:err.message});
        }

        //store into database
        const file=new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size

        });


        const response=await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
        //http://localhost:3000/files/hhdbcbd-cdbdbhbd-ducdc


    })
    



    //response -> link

})


router.post('/send',async(req,res)=>{
    //validate request
    const {uuid,emailTo,emailFrom}=req.body;
    if(!uuid||!emailTo||!emailFrom)
    {
        return res.status(422).send({error:"Alll fields are required"});
    }
    
    //get data from database
    const file=await File.findOne({uuid:uuid})
    console.log(file);
    if(file.sender)
    {
        return res.status(422).send({error:"error in file sender !!!"});
    }

    file.sender=emailFrom;
    file.receiver=emailTo;

    const response=await file.save();

    //send Email
    const sendMail=require('../services/emailServices');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:"vinay file share",
        text:`${emailFrom} share file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+"KB",
            expires:"24 hours",
        })
    });

})


module.exports=router;