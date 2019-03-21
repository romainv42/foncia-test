const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  fullname:  String,
  email: String,
  email2: String,
  telDomicile: String,
  telPro: String,
  telMobile: String,
  telMobile2: String,
  fax: String,
  sexe: String,
});

module.exports = mongoose.model('Client', clientSchema);
