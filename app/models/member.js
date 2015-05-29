var mongoose = require('mongoose');
var config = require('../../config.json');

mongoose.connect(config['MONGODB_URL']);
var Schema = mongoose.Schema;

var memberSchema = new Schema({
  first_name: String,
  last_name: String,
  email: { type: String, require: true, unique: true },
  newsletter: Boolean,
  twitter: String,
  goal: String,
  created_at: Date,
  updated_at: Date
});

memberSchema.methods.name = function() {
  return this.first_name + ' ' + this.last_name;
};

var Member = mongoose.model('Member', memberSchema);

module.exports = Member;