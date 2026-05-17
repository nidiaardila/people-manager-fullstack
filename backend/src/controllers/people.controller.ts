import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { people } from '../data/people.data';
import { Person, PersonRequestBody } from '../models/person.model';

export function getPeople(_req: Request, res: Response): void {
  res.json(people);
}

export function getPersonById(req: Request, res: Response): void {
  const { id } = req.params;

  const person = people.find((item) => item.id === id);

  if (!person) {
    res.status(404).json({
      message: 'Person not found'
    });
    return;
  }

  res.json(person);
}

export function createPerson(req: Request, res: Response): void {
  const body = req.body as PersonRequestBody;

  if (!body.firstName || !body.lastName || !body.email) {
    res.status(400).json({
      message: 'firstName, lastName and email are required'
    });
    return;
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

  res.status(201).json(newPerson);
}

export function updatePerson(req: Request, res: Response): void {
  const { id } = req.params;
  const body = req.body as PersonRequestBody;

  const personIndex = people.findIndex((item) => item.id === id);

  if (personIndex === -1) {
    res.status(404).json({
      message: 'Person not found'
    });
    return;
  }

  if (!body.firstName || !body.lastName || !body.email) {
    res.status(400).json({
      message: 'firstName, lastName and email are required'
    });
    return;
  }

  const currentPerson = people[personIndex];

  const updatedPerson: Person = {
    ...currentPerson,
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

  res.json(updatedPerson);
}

export function deletePerson(req: Request, res: Response): void {
  const { id } = req.params;

  const personIndex = people.findIndex((item) => item.id === id);

  if (personIndex === -1) {
    res.status(404).json({
      message: 'Person not found'
    });
    return;
  }

  people.splice(personIndex, 1);

  res.status(204).send();
}