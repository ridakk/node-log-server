'use strict'

let passport = require('passport');
let Strategy = require('passport-http').BasicStrategy;
let KeyCtrl = require('../controllers/keyController');
let jwt = require('jsonwebtoken');
let ReasonTexts = require('../constants/reasonTexts.js');

module.exports = (app) => {

  passport.use('log-api', new Strategy({
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, productKey, jsKey, cb) => {
      console.log('req.params.appId- ' + req.params.appId);
      console.log('LogApiStrategy- ' + productKey + ':' + jsKey);
      KeyCtrl.validateApiKeys(req.params.appId, productKey, jsKey).then(() => {
        console.log('returning success');
        return cb(null, {
          valid: true
        });
      }, (reason) => {
        console.log('invalid key error: ' + reason);
        return cb(null, false, {
          message: 'invalid key error: ' + reason
        });
      });
    }));

};
