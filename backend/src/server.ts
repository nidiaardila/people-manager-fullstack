import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

dotenv.config();

const app = express();

const PORT = process.env['PORT'] || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to People Manager API',
    endpoints: {
      health: '/api/health',
      people: '/api/people'
    }
  });
});

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface PersonRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: 'active' | 'inactive';
}

let people: Person[] = [
  {
    id: randomUUID(),
    firstName: 'Laura',
    lastName: 'García',
    email: 'laura.garcia@example.com',
    phone: '+34 600 111 222',
    city: 'Madrid',
    profession: 'Frontend Developer',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: randomUUID(),
    firstName: 'Carlos',
    lastName: 'Martínez',
    email: 'carlos.martinez@example.com',
    phone: '+34 600 333 444',
    city: 'Valencia',
    profession: 'Backend Developer',
    status: 'inactive',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'People API is running'
  });
});

app.get('/api/people', (_req: Request, res: Response) => {
  res.json(people);
});

app.get('/api/people/:id', (req: Request, res: Response) => {
  const person = people.find((item) => item.id === req.params['id']);

  if (!person) {
    return res.status(404).json({
      message: 'Person not found'
    });
  }

  return res.json(person);
});

app.post('/api/people', (req: Request, res: Response) => {
  const body = req.body as PersonRequestBody;

  if (!body.firstName || !body.lastName || !body.email) {
    return res.status(400).json({
      message: 'firstName, lastName and email are required'
    });
  }

  const now = new Date().toISOString();

  const newPerson: Person = {
    id: randomUUID(),
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone || '',
    city: body.city || '',
    profession: body.profession || '',
    status: body.status || 'active',
    createdAt: now,
    updatedAt: now
  };

  people.push(newPerson);

  return res.status(201).json(newPerson);
});

app.put('/api/people/:id', (req: Request, res: Response) => {
  const personIndex = people.findIndex((item) => item.id === req.params['id']);

  if (personIndex === -1) {
    return res.status(404).json({
      message: 'Person not found'
    });
  }

  const body = req.body as PersonRequestBody;

  const updatedPerson: Person = {
    ...people[personIndex],
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone || '',
    city: body.city || '',
    profession: body.profession || '',
    status: body.status || 'active',
    updatedAt: new Date().toISOString()
  };

  people[personIndex] = updatedPerson;

  return res.json(updatedPerson);
});

app.delete('/api/people/:id', (req: Request, res: Response) => {
  const personExists = people.some((item) => item.id === req.params['id']);

  if (!personExists) {
    return res.status(404).json({
      message: 'Person not found'
    });
  }

  people = people.filter((item) => item.id !== req.params['id']);

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`People API running on port ${PORT}`);
});