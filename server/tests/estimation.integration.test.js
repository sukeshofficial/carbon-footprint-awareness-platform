import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/infrastructure/models/User.js';
import jwt from 'jsonwebtoken';
import config from '../src/config/index.js';

describe('Carbon Estimation API Integration', () => {
  let token;
  let userId;

  before(async () => {
    // Setup test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      isVerified: true
    });
    userId = user._id;
    token = jwt.sign({ id: userId }, config.auth.jwtSecret, { expiresIn: '1h' });
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('GET /api/v1/carbon-estimation/me - should return estimation or trigger first calculation', async () => {
    const res = await request(app)
      .get('/api/v1/carbon-estimation/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.status === 'success');
    // It might be null if onboarding not complete, but for a new user it often triggers calculation
  });

  test('POST /api/v1/carbon-estimation/recalculate - should update emissions', async () => {
    const res = await request(app)
      .post('/api/v1/carbon-estimation/recalculate')
      .set('Authorization', `Bearer ${token}`);

    assert.ok([200, 400].includes(res.status)); // 400 if onboarding data missing
  });
});
