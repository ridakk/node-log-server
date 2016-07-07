"use strict";

let passport = require('passport');
let AppCtrl = require('../controllers/applicationController');
let RouteAppError = require('../utils/routeApplicationError');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

  app.post('/application', passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      if (req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new RouteAppError(ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      if (!req.body.name) {
        res.status(400).json(new RouteAppError(ReasonTexts.APP_NAME_MANDATORY));
        return;
      };

      if (!req.body.url) {
        res.status(400).json(new RouteAppError(ReasonTexts.APP_URL_MANDATORY));
        return;
      };

      // TODO: when app is created, its id should be added to its creater
      AppCtrl.create(req.body.name, req.body.url, req.user.username).then((application) => {
        res.status(202).json(application);
      }, (reason) => {
        console.log('failed\n')
          // TODO: need to refactor how to send status and error obj.
        res.status(500).send(new RouteAppError(ReasonTexts.UNKNOWN));
      });
    }
  );

  app.get('/applications', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    if (req.user.role !== ROLES.ADMIN) {
      res.status(403).json(new RouteAppError(ReasonTexts.NOT_AUTHORIZED));
      return;
    }

    AppCtrl.getAll().then((applications) => {
      if (req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new RouteAppError(ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      res.status(200).json(applications);
    }, (reason) => {
      if (reason === ReasonTexts.APP_NOT_FOUND) {
        res.status(404).send(new RouteAppError(ReasonTexts.APP_NOT_FOUND));
      } else {
        res.status(500).send(new RouteAppError(ReasonTexts.UNKNOWN));
      }
    });
  });

  app.get('/application/:id', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    AppCtrl.findByUsername(req.params.id).then((application) => {
      if (application.createdBy !== req.user.username ||
        req.user.applications.indexOf(application.id) === -1 ||
        req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new RouteAppError(ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      res.status(200).json(application);
    }, (reason) => {
      if (reason === ReasonTexts.APP_NOT_FOUND) {
        res.status(404).send(new RouteAppError(ReasonTexts.APP_NOT_FOUND));
      } else {
        res.status(500).send(new RouteAppError(ReasonTexts.UNKNOWN));
      }
    });
  });

};
