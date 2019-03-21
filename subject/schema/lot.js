const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lotSchema = new Schema({
  client:  { type: 'ObjectId', ref: 'Client' },
  surface: Number,
});

module.exports = mongoose.model('Lot', lotSchema);
