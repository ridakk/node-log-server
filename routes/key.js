"use strict";

let passport = require('passport');
let uuid = require('node-uuid');
let AppCtrl = require('../controllers/applicationController');
let KeyCtrl = require('../controllers/keyController');
let RouteKeyError = require('../utils/routeKeyError');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

  app.post('/key/:appid', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    AppCtrl.findByAppId(req.params.appid).then((application) => {
      if ((application.createdBy !== req.user.username ||
        req.user.applications.indexOf(application.id) === -1) &&
        req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new RouteKeyError(ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      console.log('creating key')
      KeyCtrl.create(application.id).then((key) => {
        res.status(202).json(key);
      }, (reason) => {
        res.status(500).send(new RouteKeyError(ReasonTexts.UNKNOWN));
      });
    }, (reason) => {
      if (reason === ReasonTexts.APP_NOT_FOUND) {
        res.status(404).send(new RouteKeyError(ReasonTexts.APP_NOT_FOUND));
      } else {
        res.status(500).send(new RouteKeyError(ReasonTexts.UNKNOWN));
      }
    });
  });

  app.get('/key/:appid', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    AppCtrl.findByAppId(req.params.appid).then((application) => {
      if ((application.createdBy !== req.user.username ||
        req.user.applications.indexOf(application.id) === -1) &&
        req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new RouteKeyError(ReasonTexts.NOT_AUTHORIZED));
        return;
      }

      KeyCtrl.findByAppId(application.id).then((keys) => {
        res.status(200).json(keys);
      }, (reason) => {
        if (reason === ReasonTexts.KEY_NOT_FOUND) {
          res.status(404).send(new RouteKeyError(ReasonTexts.KEY_NOT_FOUND));
        } else {
          res.status(500).send(new RouteKeyError(ReasonTexts.UNKNOWN));
        }
      });
    }, (reason) => {
      if (reason === ReasonTexts.APP_NOT_FOUND) {
        res.status(404).send(new RouteKeyError(ReasonTexts.APP_NOT_FOUND));
      } else {
        res.status(500).send(new RouteKeyError(ReasonTexts.UNKNOWN));
      }
    });
  });

};
