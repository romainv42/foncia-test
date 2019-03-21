// eslint-disable-next-line import/no-unresolved
const pagination = require('paginate-hooks');

const customersSchema = {
  list: {
    description: 'Retrieve paginated list of customers',
    tags: ['customers'],
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string' },
      },
    },
    query: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        pageSize: { type: 'integer' },
      },
    },
    response: {
      200: {
        type: 'object',
        description: 'Object containing requested customers',
        properties: {
          count: {
            description: 'Count of customers in database',
            type: 'integer',
          },
          page: {
            description: 'Current page returned',
            type: 'integer',
          },
          size: {
            description: 'Size of a page',
            type: 'integer',
          },
          result: {
            description: 'Resulted customers',
            type: 'array',
            items: {
              type: 'object',
              description: 'Single customer',
              properties: {
                _id: {
                  description: 'Identifier of the customer in the database',
                  type: 'string',
                },
                fullname: {
                  description: 'Full name of the customer',
                  type: 'string',
                },
                email: {
                  description: 'Principal email address of the customer',
                  type: 'string',
                },
                batchCount: {
                  description: 'Batch owned by the customer',
                  type: 'integer',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = async (fastify) => {
  fastify.register(pagination);

  fastify.get('/', { schema: customersSchema.list }, async req => fastify.dal.customers.list(req.page, req.pageSize));
};
