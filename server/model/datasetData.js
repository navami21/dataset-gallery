const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category",required: true  },
  imageUrl: String,
  csvUrl: String, 
  fileType: {
    type: String,
    default: "csv", 
  },  
  size: String,    
  columns: [String], 
  columnCount: Number,
  videos: [String],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("dataset", datasetSchema);
