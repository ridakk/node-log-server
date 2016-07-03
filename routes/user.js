"use strict";

let passport = require('passport');
let User = require('../models/user');
let Error = require('../models/error');
let ErrorCodes = require('../constants/errorCodes.js');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

  // // TODO: Development only api, remove before production !!!
  // app.post('/user', (req, res) => {
  //   console.log(req.body);
  //
  //   var newUser = new User();
  //
  //   newUser.username = req.body.username;
  //   newUser.password = newUser.generateHash(req.body.password);
  //   newUser.admin = true;
  //
  //   // save the user
  //   newUser.save((err) => {
  //     if (err) {
  //       // TODO: need to map mongo errors to user friendly error objects.
  //       console.log(err)
  //       res.status(500).send(new Error(ErrorCodes.ROUTE_USER, 'DB error'));
  //     } else {
  //       res.status(202).send(newUser);
  //     }
  //   });
  // });

  app.post('/user', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      if (req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      if (!req.body.username) {
        res.status(400).json(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.USERNAME_MANDATORY));
        return;
      };

      if (!req.body.password) {
        res.status(400).json(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.PWD_MANDATORY));
        return;
      };

      let newUser = new User();

      newUser.username = req.body.username;
      newUser.password = newUser.generateHash(req.body.password);

      newUser.role = ROLES.GUEST;
      if (req.body.role === ROLES.ADMIN) {
        newUser.role = ROLES.ADMIN;
      }

      // save the user
      newUser.save((err) => {
        if (err) {
          // TODO: need to map mongo errors to user friendly error objects.
          res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
        } else {
          res.status(202).json(newUser);
        }
      });
    }
  );

  app.get('/user/:username', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      let username = req.params.username;

      if (username !== req.user.username) {
        res.status(403).json(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.NOT_AUTHORIZED));
        return;
      };

      res.status(200).json(req.user);
    }
  );

};
