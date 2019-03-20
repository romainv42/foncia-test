const pagination = require("paginate-hooks");

const schemas = require('./schemas');

module.exports = async (fastify, _, next) => {
  fastify.register(pagination);

  fastify.get('/', { schema: schemas.list }, async (req, res) => fastify.dal.administrators.list(req.page, req.pageSize));

  fastify.get('/detail/:id', { schema: schemas.get }, async (req, res) => {
    const admin = await fastify.dal.administrators.get(req.params.id);

    return admin;
  });

  next();
};
