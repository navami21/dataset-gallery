// // middleware/upload.js
// const multer = require("multer");
// const path = require("path");

// // Storage location and filename
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories/"); // make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// // File type validation (optional)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mime = allowedTypes.test(file.mimetype);

//   if (ext && mime) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPEG, JPG, or PNG images are allowed"));
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;


const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure uploads/categories directory exists
const categoryUploadPath = path.join(__dirname, "../uploads/categories");
if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true }); // Ensures parent folders too
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryUploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|webp|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, or PNG images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
