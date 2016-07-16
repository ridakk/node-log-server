'use strict'

let passport = require('passport');
let Strategy = require('passport-http').BasicStrategy;
let UserCtrl = require('../controllers/userController');
let jwt = require('jsonwebtoken');
let ReasonTexts = require('../constants/reasonTexts.js');

module.exports = (app) => {

  // Configure the Basic strategy for use by Passport.
  //
  // The Basic strategy requires a `verify` function which receives the
  // credentials (`username` and `password`) contained in the request.  The
  // function must verify that the password is correct and then invoke `cb` with
  // a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use('basic', new Strategy(
    (username, password, cb) => {
      console.log('BasicStrategy' + username + ':' + password);
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

        console.log('returning success');
        return cb(null, {
          username: user.username,
          role: user.role,
          applications: user.applications,
          token: token
        });
      }, (reason) => {
        console.log('auth error: unkown');
        if (reason === ReasonTexts.USER_NOT_FOUND) {
          console.log('auth error: user not found');
          return cb(null, false, {
            message: 'Incorrect username.'
          });
        } else {
          console.log('auth error: unkown');
          return cb(err);
        }
      });
    }));

};
