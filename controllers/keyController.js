"use strict";

let Key = require('../models/key');
let uuid = require('node-uuid');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');

const KEY_FILTER = {
  _id: 0
};

exports.findByAppId = (appid) => {
  return new Promise((resolve, reject) => {
    Key.find({
      applicationId: appid
    }, KEY_FILTER, (err, keys) => {
      if (err) {
        console.log('keys retrieve err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }

      if (!keys) {
        reject(ReasonTexts.KEY_NOT_FOUND);
        return;
      }

      resolve(keys);
    });
  });
}

exports.validateApiKeys = (appId, productKey, jsKey) => {
    return new Promise((resolve, reject) => {
        Key.find({
            applicationId: appId
        }, KEY_FILTER, (err, keys) => {
            if (err) {
                console.log('keys retrieve err: \n');
                console.log(err);
                console.log(err.code);
                reject(ReasonTexts.UNKNOWN);
                return;
            }

            if (!keys) {
                reject(ReasonTexts.KEY_NOT_FOUND);
                return;
            }

            let len = keys.length;
            let valid = false;
            for (let i = 0; i < len; i++) {
                let key = keys[i];
                if (key.validProductKey(productKey) &&
                    key.validJsKey(jsKey)) {
                    valid = true;
                    break;
                }
            }

            if (valid) {
                resolve();
            } else {
                reject(ReasonTexts.INVALID_KEY);
            }
        });
    });
}

exports.create = (appId) => {
  return new Promise((resolve, reject) => {
    let newKey = new Key();
    let productKey = uuid.v4();
    let jsKey = uuid.v4();

    newKey.id = uuid.v1();
    newKey.productKey = newKey.generateHash(productKey);
    newKey.jsKey = newKey.generateHash(jsKey);
    newKey.applicationId = appId;

    // save the user
    newKey.save((err) => {
      if (err) {
        // TODO: need to map mongo errors to user friendly error objects.
        console.log('new key create err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
      } else {
        resolve({
          id: newKey.id,
          productKey: productKey,
          jsKey: jsKey,
          applicationId: newKey.applicationId
        });
      }
    });
  });
}

exports.delete = (keyId) => {
  return new Promise((resolve, reject) => {
    Key.remove({
      id: keyId
    }, (err, key) => {
      if (err) {
        console.log('key remove err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }
      else {
        resolve();
      }
    });
  });
}
