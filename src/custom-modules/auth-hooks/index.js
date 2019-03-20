const fastifyPlugin = require('fastify-plugin');
const jwt = require('jsonwebtoken');

async function authValidation(fastify, options, next) {
  // check authentification before anything else
  fastify.addHook('preValidation', async (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.code(401);
        return next(new Error('Unauthorized'));
    }

    const token = authorization.substring(7);
    try {
      const decoded = jwt.verify(token, options.secret);
      req.user = decoded;
    } catch (err) {
      res.code(403).send();
      return;
    }
    next();
  });

  next();
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(authValidation);
