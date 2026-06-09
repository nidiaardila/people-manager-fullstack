import dotenv from 'dotenv';

import { app } from './app';
import { initDatabase } from './database/init-db';

dotenv.config();

const PORT = process.env['PORT'] || 3000;

async function startServer(): Promise<void> {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`People API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();