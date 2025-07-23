const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name: String,
  email: { type: String, unique: true, required: true },
  password: String, // The (hashed) password sent initially, and later updated
  role: { type: String, enum: ["admin", "user"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: null },
})

module.exports=mongoose.model('user',userSchema)