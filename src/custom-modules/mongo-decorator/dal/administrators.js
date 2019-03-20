module.exports = (mongoose) => {
  const { ObjectId } = mongoose.Schema.Types;
  const model = require('../schema/gestionnaire');

  return {
    list: async (page = 1, size = 25, filter = {}) => {
      try {
        const [administrators, count] = await Promise.all([
          // Paginated result
          new Promise((resolve, reject) => {
            model.find(filter, ['_id', 'fullname'])
              .limit(size)
              .skip((page - 1) * size)
              .exec((err, data) => {
                if (err) return reject(err);
                resolve(data);
              })
          }),
          // Total count for information
          new Promise((resolve, reject) => {
            model.count({}, (err, count) => {
              if (err) return reject(err);
              resolve(count);
            })
          }),
        ]);

        return {
          count,
          page,
          size,
          result: administrators
        };
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    get: async (id) => new Promise((resolve, reject) => {
      model.findById(id, (err, data) => {
        if (err) return reject(err);
        resolve(data._doc);
      });
    })
  }
};
