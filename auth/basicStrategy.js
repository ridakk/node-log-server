'use strict'

let passport = require('passport');
let Strategy = require('passport-http').BasicStrategy;
let User = require('../models/user');
let jwt = require('jsonwebtoken');


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
      User.findOne({
        username: username
      },(err, user) => {
        if (err) {
          console.log('user retrieve err: \n');
          console.log(err);
          return cb(err);
        }

        if (!user) {
          console.log('Incorrect username.');
          return cb(null, false, {
            message: 'Incorrect username.'
          });
        }

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
          admin: user.admin,
          token: token
        });
      });
    }));

};
