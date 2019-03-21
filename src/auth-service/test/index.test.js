/* eslint-disable no-undef */

const JWT_SECRET = 'my-secret-key';
const JWT_TTL = '3600';

Object.assign(process.env, { JWT_SECRET, JWT_TTL });

const { build } = require('../index');

describe('AUTH Service', () => {
  let fastify;

  beforeAll(() => {
    fastify = build();
  });

  afterAll(() => {
    fastify.close();
  });

  it('should respond 404 error', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toBe(404);
  });

  it('should respond 401 with empty body', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: {},
    });
    expect(response.statusCode).toBe(401);
  });

  it('should respond 401 with bad body', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: { foo: 'bar' },
    });
    expect(response.statusCode).toBe(401);
  });

  it('should respond 401 with bad credentials', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: { username: 'foo', password: 'bar' },
    });
    expect(response.statusCode).toBe(401);
  });

  it('should respond 200 with an access_token', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: { username: 'john', password: 'myfonciapassword' },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('access_token');
  });
});
