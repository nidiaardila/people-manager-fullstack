import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { people } from '../data/people.data';
import { Person, PersonRequestBody, PersonStatus } from '../models/person.model';

function getQueryValue(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isValidStatus(status: string): status is PersonStatus {
  return status === 'active' || status === 'inactive';
}

export function getPeople(req: Request, res: Response): void {
  const search = getQueryValue(req.query['search']);
  const status = getQueryValue(req.query['status']);
  const city = getQueryValue(req.query['city']);
  const profession = getQueryValue(req.query['profession']);

  let filteredPeople = [...people];

  if (search) {
    filteredPeople = filteredPeople.filter((person) => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        person.email.toLowerCase().includes(search) ||
        person.phone.toLowerCase().includes(search) ||
        person.city.toLowerCase().includes(search) ||
        person.profession.toLowerCase().includes(search)
      );
    });
  }

  if (status && isValidStatus(status)) {
    filteredPeople = filteredPeople.filter(
      (person) => person.status === status
    );
  }

  if (city) {
    filteredPeople = filteredPeople.filter((person) =>
      person.city.toLowerCase().includes(city)
    );
  }

  if (profession) {
    filteredPeople = filteredPeople.filter((person) =>
      person.profession.toLowerCase().includes(profession)
    );
  }

  res.json(filteredPeople);
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