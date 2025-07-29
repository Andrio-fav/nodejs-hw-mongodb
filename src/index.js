import 'dotenv/config';
dotenv.config({ path: './.env' });
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();