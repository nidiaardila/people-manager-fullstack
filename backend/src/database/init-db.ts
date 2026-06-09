import { pool } from './db';

export async function initDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      email VARCHAR(160) NOT NULL,
      phone VARCHAR(40) NOT NULL DEFAULT '',
      city VARCHAR(80) NOT NULL DEFAULT '',
      profession VARCHAR(120) NOT NULL DEFAULT '',
      status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `);

  const result = await pool.query<{ count: string }>(
    'SELECT COUNT(*) FROM people;'
  );

  const count = Number(result.rows[0]?.count ?? 0);

  if (count === 0) {
    const now = new Date().toISOString();

    await pool.query(
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
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20);
      `,
      [
        'person-1',
        'Laura',
        'García',
        'laura.garcia@example.com',
        '+34 600 111 222',
        'Madrid',
        'Frontend Developer',
        'active',
        now,
        now,

        'person-2',
        'Carlos',
        'Martínez',
        'carlos.martinez@example.com',
        '+34 600 333 444',
        'Valencia',
        'Backend Developer',
        'inactive',
        now,
        now
      ]
    );
  }

  console.log('Database initialized successfully');
}
