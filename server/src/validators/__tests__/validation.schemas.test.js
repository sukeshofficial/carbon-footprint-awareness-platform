import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { signupSchema, loginSchema } from '../validation.schemas.js';

describe('Auth Validation Schemas', () => {
  describe('signupSchema', () => {
    test('accepts valid signup data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        username: 'testuser'
      };
      const result = signupSchema.safeParse(data);
      assert.strictEqual(result.success, true);
    });

    test('rejects invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        username: 'testuser'
      };
      const result = signupSchema.safeParse(data);
      assert.strictEqual(result.success, false);
    });

    test('rejects short password', () => {
      const data = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        username: 'testuser'
      };
      const result = signupSchema.safeParse(data);
      assert.strictEqual(result.success, false);
    });

    test('trims and lowercases input', () => {
      const data = {
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
        name: '  Test User  ',
        username: '  TestUser  '
      };
      const validated = signupSchema.parse(data);
      assert.strictEqual(validated.email, 'test@example.com');
      assert.strictEqual(validated.username, 'testuser');
      assert.strictEqual(validated.name, 'Test User');
    });
  });

  describe('loginSchema', () => {
    test('accepts valid login data', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const result = loginSchema.safeParse(data);
      assert.strictEqual(result.success, true);
    });

    test('rejects empty password', () => {
      const data = { email: 'test@example.com', password: '' };
      const result = loginSchema.safeParse(data);
      assert.strictEqual(result.success, false);
    });
  });
});
