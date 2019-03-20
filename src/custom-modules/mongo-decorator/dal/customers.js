module.exports = (mongoose) => {
  const { ObjectId } = mongoose.Schema.Types;
  const customerModel = require('../schema/client');
  const batchModel = require('../schema/lot');

  return {
    list: async (page = 1, size = 25, filter = {}) => {
      try {
        const [customers, count] = await Promise.all([
          // Paginated result
          new Promise((resolve, reject) => {
            customerModel.find(filter, ['_id', 'fullname', 'email'])
              .limit(size)
              .skip((page - 1) * size)
              .exec((err, data) => {
                if (err) return reject(err);
                resolve(data);
              })
          }),
          // Total count for information
          new Promise((resolve, reject) => {
            customerModel.count({}, (err, count) => {
              if (err) return reject(err);
              resolve(count);
            })
          }),
        ]);

        const result = await Promise.all(customers.map(c => {
          return new Promise((resolve) => {
            batchModel.count({ client: c._id }, (err, count) => {
              const result = {
                batchCount: count || 0,
                ...c._doc
              };
              resolve(result);
            });
          });
        }));

        return {
          count,
          page,
          size,
          result
        };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
};
