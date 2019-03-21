const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gestionnaireSchema = new Schema({
  fullname:  String,
  numero: Schema.Types.Mixed,
});

module.exports = mongoose.model('Gestionnaire', gestionnaireSchema);
