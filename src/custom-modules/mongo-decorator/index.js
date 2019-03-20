const fastifyPlugin = require('fastify-plugin');
const mongoose = require('mongoose');

const dal = require('./dal/index');

/**
 * Decorator to connect to database and expose mongoose object
 * @param {*} fastify
 * @param {*} options URL and any other options supported by Mongoose
 */
async function dbConnect(fastify, options) {
  const url = options.url;
  delete options.url;

  try{
    await mongoose.connect(url, options);

    const mongoDal = {
      customers: dal.customers(mongoose),
      administrators: dal.administrators(mongoose)
    };

    fastify.decorate('dal', mongoDal);
  } catch (err) {
    fastify.log.error("Unable to connect to Mongo DB", err);
    process.exit(1);
  }
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnect);
