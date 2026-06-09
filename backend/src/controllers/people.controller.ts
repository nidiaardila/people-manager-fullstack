import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

import { pool } from '../database/db';
import { Person, PersonRequestBody, PersonStatus } from '../models/person.model';

interface PersonRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: PersonStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

function mapPersonRow(row: PersonRow): Person {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    profession: row.profession,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStatus(value: unknown): PersonStatus {
  return value === 'inactive' ? 'inactive' : 'active';
}

export async function getPeople(req: Request, res: Response): Promise<void> {
  try {
    const search = normalizeText(req.query['search']).toLowerCase();
    const status = normalizeText(req.query['status']);
    const city = normalizeText(req.query['city']).toLowerCase();
    const profession = normalizeText(req.query['profession']).toLowerCase();

    const values: string[] = [];
    const conditions: string[] = [];

    if (search) {
      values.push(`%${search}%`);
      const searchParam = `$${values.length}`;

      conditions.push(`
        (
          LOWER(first_name || ' ' || last_name) LIKE ${searchParam}
          OR LOWER(email) LIKE ${searchParam}
          OR LOWER(phone) LIKE ${searchParam}
          OR LOWER(city) LIKE ${searchParam}
          OR LOWER(profession) LIKE ${searchParam}
        )
      `);
    }

    if (status === 'active' || status === 'inactive') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (city) {
      values.push(`%${city}%`);
      conditions.push(`LOWER(city) LIKE $${values.length}`);
    }

    if (profession) {
      values.push(`%${profession}%`);
      conditions.push(`LOWER(profession) LIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query<PersonRow>(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        profession,
        status,
        created_at,
        updated_at
      FROM people
      ${whereClause}
      ORDER BY created_at DESC;
      `,
      values
    );

    res.json(result.rows.map(mapPersonRow));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error getting people'
    });
  }
}

export async function getPersonById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query<PersonRow>(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        profession,
        status,
        created_at,
        updated_at
      FROM people
      WHERE id = $1;
      `,
      [id]
    );

    const person = result.rows[0];

    if (!person) {
      res.status(404).json({
        message: 'Person not found'
      });
      return;
    }

    res.json(mapPersonRow(person));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error getting person'
    });
  }
}

export async function createPerson(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as PersonRequestBody;

    const firstName = normalizeText(body.firstName);
    const lastName = normalizeText(body.lastName);
    const email = normalizeText(body.email);
    const phone = normalizeText(body.phone);
    const city = normalizeText(body.city);
    const profession = normalizeText(body.profession);
    const status = normalizeStatus(body.status);

    if (!firstName || !lastName || !email) {
      res.status(400).json({
        message: 'firstName, lastName and email are required'
      });
      return;
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const result = await pool.query<PersonRow>(
      `
      INSERT INTO people (
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        profession,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        profession,
        status,
        created_at,
        updated_at;
      `,
      [
        id,
        firstName,
        lastName,
        email,
        phone,
        city,
        profession,
        status,
        now,
        now
      ]
    );

    const createdPerson = result.rows[0];

    if (!createdPerson) {
      res.status(500).json({
        message: 'Error creating person'
      });
      return;
    }

    res.status(201).json(mapPersonRow(createdPerson));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error creating person'
    });
  }
}

export async function updatePerson(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body as PersonRequestBody;

    const firstName = normalizeText(body.firstName);
    const lastName = normalizeText(body.lastName);
    const email = normalizeText(body.email);
    const phone = normalizeText(body.phone);
    const city = normalizeText(body.city);
    const profession = normalizeText(body.profession);
    const status = normalizeStatus(body.status);
    const now = new Date().toISOString();

    if (!firstName || !lastName || !email) {
      res.status(400).json({
        message: 'firstName, lastName and email are required'
      });
      return;
    }

    const result = await pool.query<PersonRow>(
      `
      UPDATE people
      SET
        first_name = $1,
        last_name = $2,
        email = $3,
        phone = $4,
        city = $5,
        profession = $6,
        status = $7,
        updated_at = $8
      WHERE id = $9
      RETURNING
        id,
        first_name,
        last_name,
        email,
        phone,
        city,
        profession,
        status,
        created_at,
        updated_at;
      `,
      [
        firstName,
        lastName,
        email,
        phone,
        city,
        profession,
        status,
        now,
        id
      ]
    );

    const updatedPerson = result.rows[0];

    if (!updatedPerson) {
      res.status(404).json({
        message: 'Person not found'
      });
      return;
    }

    res.json(mapPersonRow(updatedPerson));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error updating person'
    });
  }
}

export async function deletePerson(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM people
      WHERE id = $1
      RETURNING id;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        message: 'Person not found'
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error deleting person'
    });
  }
}