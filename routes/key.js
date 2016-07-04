"use strict";

let passport = require('passport');
let uuid = require('node-uuid');
let User = require('../models/user');
let Key = require('../models/key');
let Error = require('../models/error');
let ErrorCodes = require('../constants/errorCodes.js');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

  app.post('/key/:appid', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      Application.findOne({
        id: req.params.appid
      }, (err, application) => {
        if (err) {
          console.log('application retrieve err: \n');
          console.log(err);
          res.status(500).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.UNKNOWN));
          return;
        }

        if (!application) {
          res.status(404).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.APP_NOT_FOUND));
          return;
        }

        if (application.createdBy !== req.user.username ||
          req.user.applications.indexOf(application.id) === -1 ||
          req.user.role !== ROLES.ADMIN) {
          res.status(403).json(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.NOT_AUTHORIZED));
          return;
        }

        let newKey = new Key();

        newKey.id = uuid.v1();
        newKey.productKey = newKey.generateHash(uuid.v4());
        newKey.jsKey = newKey.generateHash(uuid.v4());
        newKey.applicationId = application.id;

        // save the user
        newKey.save((err) => {
          if (err) {
            // TODO: need to map mongo errors to user friendly error objects.
            console.log('new key create err: \n');
            console.log(err);
            res.status(500).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.UNKNOWN));
          } else {
            res.status(202).json(newKey);
          }
        });
      });
    }
  );

  app.get('/key/:appid', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      Application.findOne({
        id: req.params.appid
      }, (err, application) => {
        if (err) {
          console.log('application retrieve err: \n');
          console.log(err);
          res.status(500).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.UNKNOWN));
          return;
        }

        if (!application) {
          res.status(404).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.APP_NOT_FOUND));
          return;
        }

        if (application.createdBy !== req.user.username ||
          req.user.applications.indexOf(application.id) === -1 ||
          req.user.role !== ROLES.ADMIN) {
          res.status(403).json(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.NOT_AUTHORIZED));
          return;
        }

        Key.find({
          applicationId: appid.id
        }, (err, keys) => {
          if (err) {
            console.log('keys retrieve err: \n');
            console.log(err);
            res.status(500).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.UNKNOWN));
            return;
          }

          if (!keys) {
            res.status(404).send(new Error(ErrorCodes.ROUTE_KEY, ReasonTexts.KEY_NOT_FOUND));
            return;
          }

          res.status(200).json(keys);
        });
      });
    }
  );

};
