"use strict";

let passport = require('passport');
let uuid = require('node-uuid');
let User = require('../models/user');
let Application = require('../models/application');
let Error = require('../models/error');
let ErrorCodes = require('../constants/errorCodes.js');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

  app.post('/application', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      if (req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      if (!req.body.name) {
        res.status(400).json(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.APP_NAME_MANDATORY));
        return;
      };

      if (!req.body.url) {
        res.status(400).json(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.APP_URL_MANDATORY));
        return;
      };

      let newApplication = new Application();

      newApplication.id = uuid.v1();
      newApplication.name = req.body.name;
      newApplication.url = req.body.url;
      newApplication.createdBy = req.user.username;

      // save the user
      newApplication.save((err) => {
        if (err) {
          // TODO: need to map mongo errors to user friendly error objects.
          console.log('new user create err: \n');
          console.log(err);
          res.status(500).send(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.UNKNOWN));
        } else {
          res.status(202).json(newApplication);
        }
      });
    }
  );

  app.get('/application/:id', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      Application.findOne({
        id: req.params.id
      }, (err, application) => {
        if (err) {
          console.log('application retrieve err: \n');
          console.log(err);
          res.status(500).send(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.UNKNOWN));
          return;
        }

        if (!application) {
          res.status(404).send(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.APP_NOT_FOUND));
          return;
        }

        if (application.createdBy !== req.user.username ||
          req.user.applications.indexOf(application.id) === -1 ||
          req.user.role !== ROLES.ADMIN) {
          res.status(403).json(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.NOT_AUTHORIZED));
          return;
        }

        res.status(200).json(application);
      });
    }
  );

};
