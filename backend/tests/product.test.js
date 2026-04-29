const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Product API', () => {
  let token;
  const username = `testuser_prod_${Date.now()}`;
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

  it('should create a new product', async () => {
    const newProduct = {
      sku: `SKU-${Date.now()}`,
      name: 'Producto de Prueba',
      price: 99.99,
      category: 'Pruebas'
    };

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);

    expect(res.status).toBe(201);
    expect(res.body.sku).toBe(newProduct.sku);
    expect(res.body.name).toBe(newProduct.name);
  });
});
