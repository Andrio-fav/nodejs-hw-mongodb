import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (request, file, cb) => cb(null, TEMP_UPLOAD_DIR),
  filename: (request, file, cb) => cb(null, file.fieldname + '_' + request.user._id + file.originalname.slice(-4)),
});
export const upload = multer({ storage });