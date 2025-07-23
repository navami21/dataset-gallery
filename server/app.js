// const express=require('express'); 
// const morgan=require('morgan');
// require('dotenv').config();
// require('./db/connection');
// const cors =require('cors');

// const PORT = process.env.PORT;
// const app=new express(); 
// app.use(express.json());
// app.use(morgan('dev'));
// app.use(cors());
// app.use("/uploads", express.static("uploads"));


// const userRoutes=require('./routes/userRoutes');
// app.use('/api/users',userRoutes)
// const adminRoutes=require('./routes/adminRoutes');
// app.use('/api/admin',adminRoutes)
// const categoryRoutes=require('./routes/categoryRoutes');
// app.use('/api/category',categoryRoutes)
// const datasetRoutes=require('./routes/datasetRoutes');
// app.use('/api/datasets',datasetRoutes)
// const projectRoutes=require('./routes/projectRoutes');
// app.use('/api/projects',projectRoutes)




// app.listen(PORT,()=>{
//     console.log(` ${PORT} is up and running `);
// })
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/uploads", express.static("uploads"));

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/projects', projectRoutes);

// Error Handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`${PORT} is up and running`);
});
