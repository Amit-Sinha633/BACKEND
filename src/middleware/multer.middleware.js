// import multer from "multer";


// const storage = multer.diskStorage({ 
//   destination: function (req, file, cb) {
//     cb(null, "../public/temp");   // cb(error,result) this is pattern 
//     console.log("Hi This call is form Multer Middleware");
    
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });


// const upload = multer({ storage });

// export default upload;
 

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // folder in cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "webp"],
  },
});

const upload = multer({ storage });

export default upload;