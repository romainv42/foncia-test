const fastifyPlugin = require('fastify-plugin');

async function paginateHooks(fastify, options, next) {
  // check authentification before anything else
  fastify.addHook("preValidation", async (req, res, nnext) => {
    const { page, pageSize } = req.query;
    req.page = parseInt(page, 10) || 1;
    req.pageSize = parseInt(pageSize, 10) || 10;
    nnext();
  });

  next();
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(paginateHooks);
