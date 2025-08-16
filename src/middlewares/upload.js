import multer from "multer";
import path from "node:path";
import { TEMP_UPLOAD_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TEMP_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}_${req.user?._id || "guest"}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({ storage, fileFilter });