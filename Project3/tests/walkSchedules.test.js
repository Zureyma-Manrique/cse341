const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

jest.mock('../db/connect');
const { getDb } = require('../db/connect');
const walkSchedulesRouter = require('../routes/walkSchedules');

function buildApp() {
  const app = express();
  app.use(express.json());
  // No session/passport middleware mounted here -> req.isAuthenticated is
  // undefined, so ensureAuthenticated correctly falls through to a 401,
  // the same as an anonymous request would get in the real app.
  app.use('/walk-schedules', walkSchedulesRouter);
  return app;
}

describe('WalkSchedules routes', () => {
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

  test('GET /walk-schedules returns 200 and a list of schedules', async () => {
    const fakeSchedules = [
      { _id: new ObjectId(), dogId: 'abc', walkerId: 'def', status: 'requested' },
      { _id: new ObjectId(), dogId: 'ghi', walkerId: 'jkl', status: 'confirmed' }
    ];
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(fakeSchedules) });

    const res = await request(app).get('/walk-schedules');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('GET /walk-schedules returns 500 when the database throws', async () => {
    mockCollection.find.mockImplementation(() => {
      throw new Error('connection lost');
    });

    const res = await request(app).get('/walk-schedules');

    expect(res.status).toBe(500);
  });

  test('GET /walk-schedules/:id returns 200 for a valid, existing schedule', async () => {
    const id = new ObjectId();
    mockCollection.findOne.mockResolvedValue({ _id: id, status: 'confirmed' });

    const res = await request(app).get(`/walk-schedules/${id.toHexString()}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  test('GET /walk-schedules/:id returns 400 for a malformed id', async () => {
    const res = await request(app).get('/walk-schedules/not-a-valid-id');

    expect(res.status).toBe(400);
  });

  test('GET /walk-schedules/:id returns 404 when no schedule matches', async () => {
    mockCollection.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/walk-schedules/${new ObjectId().toHexString()}`);

    expect(res.status).toBe(404);
  });

  test('POST /walk-schedules is protected: returns 401 when not logged in', async () => {
    const res = await request(app).post('/walk-schedules').send({});

    expect(res.status).toBe(401);
  });

  test('PUT /walk-schedules/:id is protected: returns 401 when not logged in', async () => {
    const res = await request(app).put(`/walk-schedules/${new ObjectId().toHexString()}`).send({});

    expect(res.status).toBe(401);
  });
});
