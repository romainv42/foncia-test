const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_TTL } = process.env;

const authSchema = {
  auth: {
    description: 'Authenticate user using provided username and password',
    tags: ['auth'],
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
    response: {
      200: {
        type: 'object',
        description: 'Object containing access_token',
        properties: {
          access_token: {
            type: 'string',
          },
        },
      },
      401:
      {
        type: 'null',
        description: 'Bad credentials',
      },
    },
  },
};

module.exports = async (fastify) => {
  fastify.post('/', { schema: authSchema }, (req, res) => {
    const { username, password } = req.body;
    if (username === 'john' && password === 'myfonciapassword') {
      return res.status(200).send({
        access_token: jwt.sign({
          exp: Math.floor(Date.now() / 1000) + parseInt(JWT_TTL, 10),
          data: { username },
        }, JWT_SECRET),
      });
    }
    return res.status(401).send();
  });
};
