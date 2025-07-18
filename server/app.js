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
app.use("/uploads", express.static("uploads"));


const userRoutes=require('./routes/userRoutes');
app.use('/api/users',userRoutes)
const adminRoutes=require('./routes/adminRoutes');
app.use('/api/admin',adminRoutes)
const categoryRoutes=require('./routes/categoryRoutes');
app.use('/api/category',categoryRoutes)
const datasetRoutes=require('./routes/datasetRoutes');
app.use('/api/datasets',datasetRoutes)
const projectRoutes=require('./routes/projectRoutes');
app.use('/api/projects',projectRoutes)




app.listen(PORT,()=>{
    console.log(` ${PORT} is up and running `);
})