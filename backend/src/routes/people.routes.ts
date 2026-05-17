import { Router } from 'express';

import {
  createPerson,
  deletePerson,
  getPeople,
  getPersonById,
  updatePerson
} from '../controllers/people.controller';

export const peopleRoutes = Router();

peopleRoutes.get('/', getPeople);
peopleRoutes.get('/:id', getPersonById);
peopleRoutes.post('/', createPerson);
peopleRoutes.put('/:id', updatePerson);
peopleRoutes.delete('/:id', deletePerson);