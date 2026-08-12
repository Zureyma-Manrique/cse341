const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');
const { getDb } = require('../db/connect');
const usersRouter = require('../routes/users');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/users', usersRouter);
  return app;
}

describe('Users routes', () => {
  let app;
  let mockCollection;

  beforeEach(() => {
    app = buildApp();
    mockCollection = {
      find: jest.fn(),
      findOne: jest.fn()
    };
    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users returns 200 and a list of users', async () => {
    const fakeUsers = [
      { _id: new ObjectId(), firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', role: 'owner' },
      { _id: new ObjectId(), firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.com', role: 'walker' }
    ];
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(fakeUsers) });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].email).toBe('ada@example.com');
  });

  test('GET /users returns 500 when the database throws', async () => {
    mockCollection.find.mockImplementation(() => {
      throw new Error('connection lost');
    });

    const res = await request(app).get('/users');

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/error retrieving users/i);
  });

  test('GET /users/:id returns 200 for a valid, existing user', async () => {
    const id = new ObjectId();
    mockCollection.findOne.mockResolvedValue({ _id: id, firstName: 'Ada', email: 'ada@example.com' });

    const res = await request(app).get(`/users/${id.toHexString()}`);

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Ada');
  });

  test('GET /users/:id returns 400 for a malformed id', async () => {
    const res = await request(app).get('/users/not-a-valid-id');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid user id/i);
  });

  test('GET /users/:id returns 404 when no user matches', async () => {
    mockCollection.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/users/${new ObjectId().toHexString()}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
