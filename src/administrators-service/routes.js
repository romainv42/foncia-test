const pagination = require("paginate-hooks");

const schemas = require('./schemas');
const combination = require('./combination');

module.exports = async (fastify) => {
  fastify.register(pagination);

  fastify.get('/', { schema: schemas.list }, async (req, res) => fastify.dal.administrators.list(req.page, req.pageSize));

  fastify.get('/detail/:id', { schema: schemas.get }, async (req, res) => {
    const admin = await fastify.dal.administrators.get(req.params.id);

    admin.combinations = await combination(admin.numeros);
    return {
      ...admin,
      combinations: await combination(admin.numeros)
    };
  });
};
