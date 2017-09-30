const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
  loginname: { type: String, required: true },
  avatar_url: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  signature: String,
  web: String,
  creat_time: { type: Date, default: new Date() },
});

const User = mongoose.model('User', user);

module.exports = User;
