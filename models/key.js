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

userSchema.methods.generateHash = (key) => {
  return bcrypt.hashSync(key, bcrypt.genSaltSync(8), null);
};

// checking if product key is valid
userSchema.methods.validProductKey = (productKey) => {
  return bcrypt.compareSync(prodKey, this.productKey);
};

// checking if javascript key is valid
userSchema.methods.validJsKey = (jsKey) => {
  return bcrypt.compareSync(jsKey, this.jsKey);
};

module.exports = mongoose.model('Key', keySchema);
