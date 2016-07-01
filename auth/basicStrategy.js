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
        function(username, password, cb) {
            console.log(0)
            User.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    return cb(err);
                }

                if (!user) {
                    return cb(null, false, { message: 'Incorrect username.' });
                }

                if (!user.validPassword(password)) {
                  console.log("PPPP")
                    return cb(null, false, { message: 'Incorrect password.' });
                }

                let token = jwt.sign(user, app.get('superSecret'), {
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
