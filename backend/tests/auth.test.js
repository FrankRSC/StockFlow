const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('JWT Authorization Middleware', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 403 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/products')
      .send();
    
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('No se proporcionó un token de autenticación');
  });

  it('should return 401 if an invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', 'Bearer invalid_token_here')
      .send();
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Token inválido o expirado');
  });
});
