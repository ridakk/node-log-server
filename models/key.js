'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');

// create a schema
let keySchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  applicationId: String,
  productKey: {
    type: String,
    unique: true,
    required: true
  },
  jsKey: {
    type: String,
    unique: true,
    required: true
  }
});

keySchema.methods.generateHash = function(key) {
  return bcrypt.hashSync(key, bcrypt.genSaltSync(8), null);
};

// checking if product key is valid
keySchema.methods.validProductKey = function(productKey) {
  return bcrypt.compareSync(productKey, this.productKey);
};

// checking if javascript key is valid
keySchema.methods.validJsKey = function(jsKey) {
  return bcrypt.compareSync(jsKey, this.jsKey);
};

module.exports = mongoose.model('Key', keySchema);
