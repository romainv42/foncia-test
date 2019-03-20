const administratorsSchema = {
  list: {
    description: 'Retrieve paginated list of administrators',
    tags: ['administrators'],
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string' }
      },
    },
    query: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        pageSize: { type: 'integer' }
      },
    },
    response: {
      200: {
        type: 'object',
        description: 'Object containing requested administrators',
        properties: {
          count: {
            description: 'Count of administrators in database',
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
            description: 'Resulted administrators',
            type: 'array',
            items: {
              type: 'object',
              description: 'Single administrator',
              properties: {
                _id: {
                  description: 'Identifier of the administrator in the database',
                  type: 'string',
                },
                fullname: {
                  description: 'Full name of the administrator',
                  type: 'string',
                }
              },
            },
          },
        },
      },
    },
  },
  get: {
    description: 'Retrieve information about a specified administrator',
    tags: ['administrators'],
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string' }
      },
    },
    params: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "ea15acedac3c077d1d983da5b0e0e76f",
          description: "The id of the requested administrator"
        }
      },
      required: ["id"],
    },
    response: {
      200: {
        type: 'object',
        description: 'Object containing requested administrator',
        properties: {
          _id: {
            description: 'Identifier of the administrator in the database',
            type: 'string',
          },
          fullname: {
            description: 'Full name of the administrator',
            type: 'string',
          },
          combinations: {
            description: 'List of available agency combination for this administrator',
            type: 'array',
            items: {
              type: 'string'
            },
          },
        },
      },
    },
  },
};

module.exports = administratorsSchema;
