'use strict'

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let passport = require('passport');
let User = require('../models/user');
let jwt = require('jsonwebtoken');
let opts = {};


module.exports = (app) => {

  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = app.get('superSecret');

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('jwt_payload: \n');
    console.log(jwt_payload);
    console.log('user: \n');
    console.log(jwt_payload.user);
    if (jwt_payload) {
      done(null, jwt_payload.user);
    } else {
      done(null, false);
    }
  }));


};
