const express=require('express'); 

const morgan=require('morgan');

require('dotenv').config();
require('./db/connection');
const cors =require('cors');

const PORT = process.env.PORT;


const app=new express(); 
app.use(morgan('dev'));
app.use(cors());




app.listen(PORT,()=>{
    console.log(` ${PORT}is up and running `);
})