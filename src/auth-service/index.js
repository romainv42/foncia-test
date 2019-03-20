const fastify = require('fastify')({ logger: true });

const { PORT, NODE_ENV } = process.env;

fastify.register(require('./routes'));

if (NODE_ENV === 'test') {
  module.exports = { build: () => fastify };
} else {
  (async () => {
    try {
      fastify.log.info(`Starting server listening on port: ${PORT || 3000}`);
      await fastify.listen(PORT || 3000, '0.0.0.0');
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  })();
}
