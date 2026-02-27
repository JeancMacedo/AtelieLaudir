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
  const collections = Object.keys(mongoose.connection.collections);
  for (const c of collections) {
    await mongoose.connection.collections[c].deleteMany({});
  }
});

test('chat history list and detail', async () => {
  const agent = request.agent(app);

  const reg = await agent.post('/auth/register').send({ email: 'chat@example.com', password: 'secret123' });
  expect(reg.status).toBe(201);

  const login = await agent.post('/auth/login').send({ email: 'chat@example.com', password: 'secret123' });
  expect(login.status).toBe(200);
  const token = login.body.accessToken;

  const create = await agent
    .post('/chats')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Cliente Ana',
      messages: [
        { sender: 'Cliente', content: 'Oi' },
        { sender: 'Ateliê', content: 'Olá, em que posso ajudar?' }
      ]
    });
  expect(create.status).toBe(201);

  const list = await agent.get('/chats').set('Authorization', `Bearer ${token}`);
  expect(list.status).toBe(200);
  expect(list.body.data).toHaveLength(1);
  expect(list.body.data[0]).toHaveProperty('lastMessage');

  const chatId = list.body.data[0]._id;
  const detail = await agent.get(`/chats/${chatId}`).set('Authorization', `Bearer ${token}`);
  expect(detail.status).toBe(200);
  expect(detail.body.messages).toHaveLength(2);
});
