import fs from 'node:fs/promises';
import path from 'node:path';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function saveFileToUploadDir(file) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const tempPath = path.join(TEMP_UPLOAD_DIR, file.filename);
    const finalPath = path.join(UPLOAD_DIR, file.filename);

    await fs.rename(tempPath, finalPath);

    return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
  } catch (err) {
    console.error('Error while saving file to upload dir:', err);
    throw err;
  }
}