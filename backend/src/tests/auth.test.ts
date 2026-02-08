import { describe, it, expect } from 'vitest';
import { app } from '../index';

describe('Authentication Integration Tests', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
  };
  let sessionCookie: string;

  it('should register a new user', async () => {
    const res = await app.request('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe(testUser.email);
  });

  it('should login with the new user', async () => {
    const res = await app.request('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    expect(res.status).toBe(200);
    const cookieHeader = res.headers.get('set-cookie');
    expect(cookieHeader).toBeTruthy();
    if (cookieHeader) {
      sessionCookie = cookieHeader;
    }
  });

  it('should get current user profile', async () => {
    const res = await app.request('/api/me', {
      method: 'GET',
      headers: {
        Cookie: sessionCookie,
      },
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.email).toBe(testUser.email);
  });

  it('should update user profile', async () => {
    const newName = 'Updated Test User';
    const res = await app.request('/api/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({ name: newName }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.name).toBe(newName);
  });

  it('should fail to access protected route without cookie', async () => {
    const res = await app.request('/api/me', {
      method: 'GET',
    });
    expect(res.status).toBe(401);
  });

  it('should delete the user account', async () => {
    const res = await app.request('/api/me', {
      method: 'DELETE',
      headers: {
        Cookie: sessionCookie,
      },
    });

    expect(res.status).toBe(200);
  });

  it('should fail to login after deletion', async () => {
    const res = await app.request('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    // implementation detail: better-auth returns 401 or specific error on invalid credentials
    // depending on config, usually 401 or 400 for user not found?
    // Let's check status. Usually 400 or 401.
    // status is likely NOT 200.
    expect(res.status).not.toBe(200);
  });
});
