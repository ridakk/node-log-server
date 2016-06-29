'use strict'

let passport = require('passport');
let Strategy = require('passport-http').BasicStrategy;
let Users = require('../models/users');
let jwt    = require('jsonwebtoken');


// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    Users.findByUsername(username, function(err, user) {
      if (err) {
        return cb(err);
      }

      if (!user) {
        return cb(null, false);
      }

      if (user.validPassword(password)) {
        return cb(null, false);
      }

      user.token = jwt.sign(user, app.get('superSecret'), {
        expiresInMinutes: 1440 // expires in 24 hours
      });

      return cb(null, user);
    });
  }));
