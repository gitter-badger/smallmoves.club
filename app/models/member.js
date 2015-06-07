var config = require('../config.js');

var mongoose = require('mongoose');
mongoose.connect(config.mongodb_url);

var Schema = mongoose.Schema;

var memberSchema = new Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  newsletter: Boolean,
  twitter: String,
  goal: String,
  signup_date: { type: Date, default: Date.now },
  joined_slack: { type: Boolean, default: false },
  joined_slack_date: Date,
  slack_user_id: String,
  slack_user_name: String
});

memberSchema.methods.name = function() {
  return this.first_name + ' ' + this.last_name;
};

var Member = mongoose.model('Member', memberSchema);

module.exports = Member;