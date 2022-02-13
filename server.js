const express=require('express');
const app=express();
const connectDB=require('./config/db');
const path=require('path');

connectDB();

app.set('views',path.join(__dirname,'/views'));

app.set('view engine','ejs');
app.use(express.json());
//all routes
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})