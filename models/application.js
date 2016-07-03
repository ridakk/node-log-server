'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');

// create a schema
let applicationSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  url: String,
  keys: [String]
});

module.exports = mongoose.model('Application', applicationSchema);
