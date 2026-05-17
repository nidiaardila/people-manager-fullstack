import { randomUUID } from 'node:crypto';
import { Person } from '../models/person.model';

const now = new Date().toISOString();

export const people: Person[] = [
  {
    id: randomUUID(),
    firstName: 'Laura',
    lastName: 'García',
    email: 'laura.garcia@example.com',
    phone: '+34 600 111 222',
    city: 'Madrid',
    profession: 'Frontend Developer',
    status: 'active',
    createdAt: now,
    updatedAt: now
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
    createdAt: now,
    updatedAt: now
  }
];