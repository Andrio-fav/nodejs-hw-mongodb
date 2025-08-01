import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';

import contactsRouter from './routes/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = getEnvVar('PORT');

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());

  app.get('/', (req, res) => {
    res.json({
      message: 'This is my Contact App',
    });
  });
  app.use('/contacts', contactsRouter);

  app.use('', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw new Error(error);
    }
    console.log(`Server is running on port ${PORT}`);
  });
};