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

      // Mock para GET /authors/:id (Consultar un solo autor)
      if (sql.includes('SELECT * FROM authors WHERE id')) {
        const idBuscado = Number(params[0]);

        if (idBuscado === 999) {
          return { rows: [] };
        }

        return {
          rows: [{ id: idBuscado, name: 'Autor encontrado', email: 'autor@example.com' }]
        };
      }

      // Mock para GET /authors (Traer todos)
      if (sql.includes('SELECT * FROM authors')) {
        return { 
          rows: [
            { id: 1, name: 'Tony Stark', email: 'tony@stark.com' },
            { id: 2, name: 'Steve Rogers', email: 'cap@avengers.com' }
          ] 
        };
      }

      // Mock para DELETE /authors/:id
      if (sql.includes('DELETE FROM authors')) {
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

//TEST de Actualizar un author
describe('PUT/authors/:id', ()=>{
    test('6. Que el query parameter sea un numero', async()=>{
        const valor = 15; 
        expect(queSeaNum(valor)).toBe(true);                
    });
    
    test('7. Que rechace un valor diferente a numero', async()=>{
        const valor = 'abc'; 
        expect(queSeaNum(valor)).toBe(false);                
    });

    test('8. Rechaza request vacío al actualizar un usuario', async () => {
        const response = await request(app)
        .put('/authors/:id')
        .send({});
        expect(response.statusCode).toBe(400);
    });

    test('9. Validar Formato de Email Correcto', async()=>{
        const response = await request(app)
        .put('/authors/1')
        .send({id:1, name: 'zucaritas', email: 'el_tigreexample.com' });                        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('the email format is invalid');
    });

});

//TEST Consultar Todos los autores
describe('GET/authors', ()=>{
  test('10. Consulta todos los authors', async () => {
        const response = await request(app)
        .get('/authors')        
        expect(response.statusCode).toBe(200);            
    });
});

describe('GET/authors/:id', ()=>{
  test('11. Consulta el author por id', async()=>{
        const response = await request(app)
        .get('/authors/5')        
        expect(response.statusCode).toBe(200);        
    });

  test('12. Que el query parameter sea un numero', async()=>{
        const valor = 15; 
        expect(queSeaNum(valor)).toBe(true);                
    });
  
  test('12. Que el query parameter sea un String', async()=>{
      const response = await request(app)
      .get('/authors/abc');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toContain('ID must be a number');              
  });

  
})

describe('DELETE/authors/:id', ()=>{
  test('13. Eliminar un author exitosamente', async()=>{
    const response = await request (app)
    .delete('/authors/5');

    expect(response.statusCode).toBe(200);     
  })

  test('14. Eliminar un author que no existe', async()=>{
    const response = await request (app)
    .delete('/authors/999');
    expect(response.statusCode).toBe(404);     
  })
})


