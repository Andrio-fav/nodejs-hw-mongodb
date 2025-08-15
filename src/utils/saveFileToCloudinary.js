import fs from 'node:fs/promises';
import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

export async function saveFileToCloudinary(file) {
  cloudinary.v2.config({
    cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME, 'demo'), 
    api_key: getEnvVar(CLOUDINARY.API_KEY, '123456'),     
    api_secret: getEnvVar(CLOUDINARY.API_SECRET, 'abcxyz'),
  });

  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
}
