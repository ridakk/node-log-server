"use strict";

let passport = require('passport');
let User = require('../models/user');
let Error = require('../models/error');

module.exports = (app) => {

  // TODO: Development only api, remove before production !!!
  app.post('/user', function(req, res) {
    console.log(req.body);

    var newUser = new User();

    newUser.username = req.body.username;
    newUser.password = newUser.generateHash(req.body.password);
    newUser.admin = true;

    // save the user
    newUser.save(function(err) {
      if (err) {
        // TODO: need to map mongo errors to user friendly error objects.
        console.log(err)
        res.status(500).send(new Error(1000, 'DB error'));
      }
      else {
        res.status(202).send(newUser);
      }
    });
  });

  app.post('/profile', passport.authenticate('jwt', { session: false}),
      function(req, res) {
          res.send(req.user);
      }
  );

};
