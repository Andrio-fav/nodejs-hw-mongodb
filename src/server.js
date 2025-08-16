import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';

import { getEnvVar } from './utils/getEnvVar.js';
import router from './routes/index.js'; 
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HTTP_PORT, UPLOAD_DIR } from './constants/index.js';

export const setupServer = () => {
  const app = express();
  const PORT = getEnvVar('PORT') || HTTP_PORT;

  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors({}));
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.get('/', (req, res) => {
    res.json({
      message: 'This is my Contact App',
    });
  });

  app.use(router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw new Error(error);
    }
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
