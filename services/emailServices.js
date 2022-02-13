const res = require('express/lib/response');
const nodemailer=require('nodemailer');



async function sendMail({from,to,subject,text,html}){
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASSWORD
        }

    })

    let info=await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    });
    
    return res.send({success:true});


}


module.exports=sendMail;