import cors from 'cors';
import express from 'express';

import { healthRoutes } from './routes/health.routes';
import { peopleRoutes } from './routes/people.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to People Manager API',
    endpoints: {
      health: '/api/health',
      people: '/api/people'
    }
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/people', peopleRoutes);