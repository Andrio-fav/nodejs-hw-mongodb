import 'dotenv/config'; 
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';


import router from './routes/index.js';
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
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({
      message: 'This is my Contact App',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
      });
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await getContactById(id);
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }
      res.json({
        status: 200,
        message: `Successfully found contact with id: ${id}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error',
      });
    }
  });

  
  app.use('', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, (error) => {
    if (error) {
      throw new Error(error);
    }
    console.log(`Server is running on port ${PORT}`);
  });
};