'use strict'

let passport = require('passport');
let Strategy = require('passport-http').BasicStrategy;
let UserCtrl = require('../controllers/userController');
let jwt = require('jsonwebtoken');
let ReasonTexts = require('../constants/reasonTexts.js');

module.exports = (app) => {

  passport.use('user-login', new Strategy(
    (username, password, cb) => {
      UserCtrl.findByUsername(username, {
        _id: 0,
        username: 1,
        role: 1,
        applications: 1,
        password: 1
      }).then((user) => {
        if (!user.validPassword(password)) {
          console.log('Incorrect username.');
          return cb(null, false, {
            message: 'Incorrect password.'
          });
        }

        // TODO: this is creating new tokens
        // should return previous token if user has one.
        let token = jwt.sign({
          user: user
        }, app.get('superSecret'), {
          expiresIn: 3600 // expires in 1 hour
        });

        return cb(null, {
          username: user.username,
          role: user.role,
          applications: user.applications,
          token: token
        });
      }, (reason) => {
        console.log('auth error: ' + reason);
        return cb(null, false, {
          message: 'auth error: ' + reason
        });
      });
    }));

};
