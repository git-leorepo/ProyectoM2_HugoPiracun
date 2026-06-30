// validators.test.js
import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { validarEmail, queSeaNum } from './validators';

// Mock del pool de PostgreSQL
vi.mock('../db/config', () => ({
  default: {
    query: vi.fn(async (sql, params) => {

    console.log('🔍 MOCK RECIBIÓ -> SQL:', sql, 'PARAMS:', params);
      // Mock para verificar si el email ya existe
      if (sql.includes('SELECT * FROM posts WHERE email')) {
        return { rows: [] }; // Email no existe
    }
    
      // Mock para INSERT - crear autor
    if (sql.includes('INSERT INTO posts')) {
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

      // Mock para GET /authors/:id (Consultar un solo autor)
      if (sql.includes('SELECT * FROM posts WHERE id')) {
        const idBuscado = Number(params[0]);

        if (idBuscado === 999) {
            return { rows: [] };
        }

        return {
            rows: [{ id: idBuscado, name: 'Autor encontrado', email: 'autor@example.com' }]
        };
    }

      // Mock para GET /authors (Traer todos)
      if (sql.includes('SELECT * FROM posts')) {
        return { 
        rows: [
            { id: 1, name: 'Tony Stark', email: 'tony@stark.com' },
            { id: 2, name: 'Steve Rogers', email: 'cap@avengers.com' }
            ] 
        };
        }

      // Mock para DELETE /authors/:id
        if (sql.includes('DELETE FROM posts')) {
        const authorId = params ? Number(params[0]) : null;

        if (authorId === 999) {
            return { rows: [] };
        }

        return { 
            rowCount: 1, 
            rows: [{ id: Number(authorId), name: 'Autor Eliminado' }] 
        };  
        }          
    })
  }
}));

describe ('POST/posts', ()=>{
    test('1. Validar que no se pueda crear un post sin title, content y author', async () =>{
        const response = await request(app)
        .post('/posts')
        .send({});
        expect(response.statusCode).toBe(400);
    });
});