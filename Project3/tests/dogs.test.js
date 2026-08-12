const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');
const { getDb } = require('../db/connect');
const dogsRouter = require('../routes/dogs');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/dogs', dogsRouter);
  return app;
}

describe('Dogs routes', () => {
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

  test('GET /dogs returns 200 and a list of dogs', async () => {
    const fakeDogs = [
      { _id: new ObjectId(), name: 'Biscuit', breed: 'Golden Retriever', size: 'large' },
      { _id: new ObjectId(), name: 'Pepper', breed: 'Beagle', size: 'small' }
    ];
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(fakeDogs) });

    const res = await request(app).get('/dogs');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Biscuit');
  });

  test('GET /dogs returns 500 when the database throws', async () => {
    mockCollection.find.mockImplementation(() => {
      throw new Error('connection lost');
    });

    const res = await request(app).get('/dogs');

    expect(res.status).toBe(500);
  });

  test('GET /dogs/:id returns 200 for a valid, existing dog', async () => {
    const id = new ObjectId();
    mockCollection.findOne.mockResolvedValue({ _id: id, name: 'Biscuit', breed: 'Golden Retriever' });

    const res = await request(app).get(`/dogs/${id.toHexString()}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Biscuit');
  });

  test('GET /dogs/:id returns 400 for a malformed id', async () => {
    const res = await request(app).get('/dogs/not-a-valid-id');

    expect(res.status).toBe(400);
  });

  test('GET /dogs/:id returns 404 when no dog matches', async () => {
    mockCollection.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/dogs/${new ObjectId().toHexString()}`);

    expect(res.status).toBe(404);
  });
});
