const {
  PORT,
  NODE_ENV,
  MONGO_URL,
  MONGO_USER,
  MONGO_PASSWORD,
  JWT_SECRET,
} = process.env;


const fastify = require('fastify')({ logger: NODE_ENV !== 'test' });
const mongoDecorator = require('mongo-decorator');
const authHooks = require('auth-hooks');

fastify.register(authHooks, { secret: JWT_SECRET });

fastify.register(mongoDecorator, {
  url: `mongodb://${MONGO_URL}`,
  user: MONGO_USER,
  pass: MONGO_PASSWORD,
  dbName: 'myFonciaBdd',
});

fastify.register(require('./routes'));

if (NODE_ENV === 'test') {
  module.exports = { build: () => fastify };
} else {
  (async () => {
    try {
      fastify.log.info(`Starting server listening on port: ${PORT || 3000}`);
      await fastify.listen(3000, '0.0.0.0');
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  })();
}
