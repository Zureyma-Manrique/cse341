const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');
const { getDb } = require('../db/connect');
const reviewsRouter = require('../routes/reviews');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/reviews', reviewsRouter);
  return app;
}

describe('Reviews routes', () => {
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

  test('GET /reviews returns 200 and a list of reviews', async () => {
    const fakeReviews = [
      { _id: new ObjectId(), rating: 5, comment: 'Great!' },
      { _id: new ObjectId(), rating: 4, comment: 'Good.' }
    ];
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(fakeReviews) });

    const res = await request(app).get('/reviews');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('GET /reviews returns 500 when the database throws', async () => {
    mockCollection.find.mockImplementation(() => {
      throw new Error('connection lost');
    });

    const res = await request(app).get('/reviews');

    expect(res.status).toBe(500);
  });

  test('GET /reviews/:id returns 200 for a valid, existing review', async () => {
    const id = new ObjectId();
    mockCollection.findOne.mockResolvedValue({ _id: id, rating: 5 });

    const res = await request(app).get(`/reviews/${id.toHexString()}`);

    expect(res.status).toBe(200);
    expect(res.body.rating).toBe(5);
  });

  test('GET /reviews/:id returns 400 for a malformed id', async () => {
    const res = await request(app).get('/reviews/not-a-valid-id');

    expect(res.status).toBe(400);
  });

  test('GET /reviews/:id returns 404 when no review matches', async () => {
    mockCollection.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/reviews/${new ObjectId().toHexString()}`);

    expect(res.status).toBe(404);
  });

  test('POST /reviews is protected: returns 401 when not logged in', async () => {
    const res = await request(app).post('/reviews').send({});

    expect(res.status).toBe(401);
  });

  test('PUT /reviews/:id is protected: returns 401 when not logged in', async () => {
    const res = await request(app).put(`/reviews/${new ObjectId().toHexString()}`).send({});

    expect(res.status).toBe(401);
  });
});
