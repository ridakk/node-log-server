'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create a schema
let logSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  applicationId: String,
  platform: String,
  version: String,
  config: String,
  reporter: String,
  description: String,
  log: String,
  screenShot: String,
  status: String
});

module.exports = mongoose.model('Log', logSchema);
