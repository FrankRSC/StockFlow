const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Branch API', () => {
  let token;
  const username = `testuser_branch_${Date.now()}`;
  const password = 'password123';

  beforeAll(async () => {
    // Registrar usuario
    await request(app)
      .post('/api/auth/signup')
      .send({ username, password });

    // Login para obtener token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username, password });
    
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new branch', async () => {
    const newBranch = {
      name: `Sucursal ${Date.now()}`,
      location: 'Ubicación de Prueba'
    };

    const res = await request(app)
      .post('/api/branches')
      .set('Authorization', `Bearer ${token}`)
      .send(newBranch);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newBranch.name);
    expect(res.body.location).toBe(newBranch.location);
  });
});
