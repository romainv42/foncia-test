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
  administrators: {
    list: jest.fn(),
    get: jest.fn(),
  },
};

const mongoMock = fastifyPlugin(async (fastify) => {
  fastify.decorate('dal', adminMock);
});

describe('Administrators Service', () => {
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

  it('detail admin should respond with 401 if no token', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/details/random-id',
    });
    expect(response.statusCode).toBe(401);
  });

  it('detail admin should respond with 403 if token is bad', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/details/random-id',
      headers: {
        authorization: 'TO-FAIL',
      },
    });
    expect(response.statusCode).toBe(403);
  });

  it('should respond with 403 if token is bad', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/details/random-id',
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

  it('should return an administrator', async () => {
    adminMock.administrators.get.mockResolvedValue({
      _id: '5c6c35eaa3378e1809937d5a',
      fullname: 'Arnaud Leboda',
      numeros: {
        x: 4,
        l: {
          x: 5,
          l: {
            x: 4,
            l: {
              x: 5,
              l: null,
              r: null,
            },
            r: null,
          },
          r: null,
        },
        r: {
          x: 6,
          l: {
            x: 1,
            l: null,
            r: null,
          },
          r: {
            x: 6,
            l: null,
            r: null,
          },
        },
      },
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/detail/5c6c35eaa3378e1809937d5a',
      headers: {
        authorization: 'GOOD-TOKEN',
      },
    });
    expect(response.statusCode).toBe(200);
    expect(adminMock.administrators.get).toHaveBeenCalledWith('5c6c35eaa3378e1809937d5a');
    expect(JSON.parse(response.body)).toEqual({
      _id: '5c6c35eaa3378e1809937d5a',
      fullname: 'Arnaud Leboda',
      combinations: [
        '4.5.4.5',
        '4.6.1',
        '4.6.6',
      ],
    });
  });
});
