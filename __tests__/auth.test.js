const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = require('../src/server');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  // clear db
  const collections = Object.keys(mongoose.connection.collections);
  for (const c of collections) {
    await mongoose.connection.collections[c].deleteMany({});
  }
});

test('register -> login -> create service -> refresh -> logout flow', async () => {
  const agent = request.agent(app);

  // register
  const reg = await agent.post('/auth/register').send({ email: 'test@example.com', password: 'secret123' });
  expect(reg.status).toBe(201);

  // login
  const login = await agent.post('/auth/login').send({ email: 'test@example.com', password: 'secret123' });
  expect(login.status).toBe(200);
  expect(login.body).toHaveProperty('accessToken');
  const token = login.body.accessToken;
  // cookie should be set (refreshToken)
  const cookies = login.headers['set-cookie'];
  expect(cookies).toBeDefined();

  // create service with Authorization header
  const create = await agent.post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Teste', description: 'x', price: 10, available: true });
  expect(create.status).toBe(201);

  // refresh token (uses cookie stored in agent)
  const refresh = await agent.post('/auth/refresh').send();
  expect(refresh.status).toBe(200);
  expect(refresh.body).toHaveProperty('accessToken');

  // logout
  const out = await agent.post('/auth/logout').send();
  expect(out.status).toBe(200);

  // after logout, refresh should fail
  const refresh2 = await agent.post('/auth/refresh').send();
  expect(refresh2.status).toBe(401);
});
