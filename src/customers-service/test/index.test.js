/* eslint-disable no-undef */
const fastifyPlugin = require('fastify-plugin');

const JWT_SECRET = 'my-secret-key';
const JWT_TTL = '3600';

Object.assign(process.env, { JWT_SECRET, JWT_TTL });

const authHooksMock = fastifyPlugin(async fastify => fastify.addHook('preValidation', async (req, res, next) => {
  if (!req.headers.authorization) {
    res.code(401);
    return next(new Error('Unauthorized'));
  }
  if (req.headers.authorization === 'TO-FAIL') {
    res.code(403);
    return next(new Error('Forbidden'));
  }
  return next();
}));

const adminMock = {
  customers: {
    list: jest.fn(),
  },
};

const mongoMock = fastifyPlugin(async (fastify) => {
  fastify.decorate('dal', adminMock);
});

describe('CUSTOMERS Service', () => {
  let fastify;

  beforeAll(() => {
    jest.doMock('auth-hooks', () => authHooksMock);
    jest.doMock('mongo-decorator', () => mongoMock);

    const { build } = require('../index');

    fastify = build();
  });

  afterAll(() => {
    fastify.close();
  });

  it('list admin should respond with 401 if no token', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toBe(401);
  });

  it('list admin should respond with 403 if token is bad', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: 'TO-FAIL',
      },
    });
    expect(response.statusCode).toBe(403);
  });


  it('should respond with 404 for unknow routes', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/bad-route',
      headers: {
        authorization: 'GOOD-TOKEN',
      },
    });
    expect(response.statusCode).toBe(404);
  });

  it('should return a list', async () => {
    adminMock.administrators.list.mockResolvedValue({
      count: 3,
      page: 1,
      size: 10,
      result: [
        {
          _id: '5be0e99d9228d14c03dae2fb',
          fullname: 'Regan Schmitt',
          email: 'Gabriella_Jenkins@yahoo.com',
          batchCount: 2,
        },
        {
          _id: '5be0e99d9228d14c03dae2fc',
          fullname: 'Hershel Luettgen',
          email: 'Jaleel47@gmail.com',
          batchCount: 3,
        },
        {
          _id: '5be0e99d9228d14c03dae2fd',
          fullname: 'Hattie Prohaska',
          email: 'Eloisa.Daugherty@yahoo.com',
          batchCount: 2,
        },
      ],
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: 'GOOD-TOKEN',
      },
    });
    expect(response.statusCode).toBe(200);
    expect(adminMock.administrators.list).toHaveBeenCalledWith(1, 10);
  });

  it('should be called with pagination query params', async () => {
    adminMock.administrators.list.mockResolvedValue({
      count: 3,
      page: 1,
      size: 10,
      result: [
        {
          _id: '5c69c5a9a3378e1809930322',
          fullname: 'Mathieu Balavard',
        },
        {
          _id: '5c6c35eaa3378e1809937d5a',
          fullname: 'Arnaud Leboda',
        },
        {
          _id: '5c6c36c9a3378e1809937dde',
          fullname: 'Maxime Terci',
        },
      ],
    });

    await fastify.inject({
      method: 'GET',
      url: '/?page=2&pageSize=42',
      headers: {
        authorization: 'GOOD-TOKEN',
      },
    });
    expect(adminMock.administrators.list).toHaveBeenCalledWith(2, 42);
  });
});
