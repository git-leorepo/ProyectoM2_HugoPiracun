import { describe, it, expect, beforeEach } from 'vitest';
import { resolveDbConfig } from '../db/config.js';

describe('resolveDbConfig', () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.DB_URL;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
  });

  it('uses DATABASE_URL when Railway provides it', () => {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://user:secret@db.internal:5432/appdb';

    const config = resolveDbConfig();

    expect(config).toEqual({
      connectionString: 'postgresql://user:secret@db.internal:5432/appdb',
      ssl: { rejectUnauthorized: false }
    });
  });
});
