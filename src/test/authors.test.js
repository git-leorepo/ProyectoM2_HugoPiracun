// validators.test.js
import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { validarEmail, queSeaNum } from './validators';

// Mock del pool de PostgreSQL
vi.mock('../db/config', () => ({
  default: {
    query: vi.fn(async (sql, params) => {
      // Mock para verificar si el email ya existe
      if (sql.includes('SELECT * FROM authors WHERE email')) {
        return { rows: [] }; // Email no existe
      }
      
      // Mock para INSERT - crear autor
      if (sql.includes('INSERT INTO authors')) {
        const [name, email, bio] = params;
        return {
          rows: [{
            id: 2,
            name,
            email,
            bio: bio || '',
            created_at: '2026-06-20T12:00:00.000Z'
          }]
        };
      }
      
      // Mock para otros queries
      return { rows: [] };
    })
  }
}));

//TEST de Crear authors
describe ('POST/authors', ()=>{
    test('1. crea usuario con datos válidos', async () => {
        const response = await request(app)
        .post('/authors')
        .send({ name: 'el tigre abelardo', email: 'el_tigre@example.com' });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('el tigre abelardo');
        expect(response.body.email).toBe('el_tigre@example.com');    
    });

    test('2. Rechaza request vacío al crear un usuario', async () => {
        const response = await request(app)
        .post('/authors')
        .send({});
        expect(response.statusCode).toBe(400);
    });

    test('3. Rechaza request sin nombre al crear un usuario', async()=>{
        const response =await request(app)
        .post('/authors')
        .send({email: 'email@example.com'});
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('name and email are required')
    });

    test('4. Rechaza request sin email al crear un usuario', async()=>{
        const response =await request(app)
        .post('/authors')
        .send({name: 'Leonardo'});
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('name and email are required')
    });

    test('5. Validar Formato de Email Correcto', async()=>{
        const response = await request(app)
        .post('/authors')
        .send({ name: 'zucaritas', email: 'el_tigreexample.com' });                        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('the email format is invalid');
    });
})


//TEST de Consultar un author
describe('GET/authors/id', ()=>{
    test('1. Que el query parameter sea un numero', async()=>{
        const valor = 15; 
        expect(queSeaNum(valor)).toBe(true);                
    });
});
