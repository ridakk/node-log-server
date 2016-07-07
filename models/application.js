'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let applicationSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  createdBy: String,
  url: {
    type: String,
    required: true
  },
  keys: [String]
});

module.exports = mongoose.model('Application', applicationSchema);
