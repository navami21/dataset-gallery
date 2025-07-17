const express=require('express'); 
const morgan=require('morgan');
require('dotenv').config();
require('./db/connection');
const cors =require('cors');

const PORT = process.env.PORT;
const app=new express(); 
app.use(express.json());

app.use(morgan('dev'));
app.use(cors());


const userRoutes=require('./routes/userRoutes');
app.use('/api/users',userRoutes)

app.listen(PORT,()=>{
    console.log(` ${PORT} is up and running `);
})