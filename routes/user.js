"use strict";

let passport = require('passport');
let UserCtrl = require('../controllers/userController');
let RouteUserError = require('../utils/routeUserError');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

  // // TODO: Development only api, remove before production !!!
  // app.post('/userdev', (req, res) => {
  //   console.log(req.body);
  //
  //   UserCtrl.create(req.body.username, req.body.password, ROLES.ADMIN).then((user) => {
  //     res.status(202).json(user);
  //   }, (reason) => {
  //     res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
  //   });
  // });

  app.post('/user', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    if (req.user.role !== ROLES.ADMIN) {
      res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
      return;
    }

    if (!req.body.username) {
      res.status(400).json(new RouteUserError(ReasonTexts.USERNAME_MANDATORY));
      return;
    };

    if (!req.body.password) {
      res.status(400).json(new RouteUserError(ReasonTexts.PWD_MANDATORY));
      return;
    };

    UserCtrl.create(req.body.username, req.body.password, req.body.role).then((user) => {
      res.status(202).json(user);
    }, (reason) => {
      res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
    });
  });

  // TODO: find users with application id is missing, implement it.
  // TODO: delete app from user is missing, implement it.
  app.post('/user/:username/:appId', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    if (req.user.role !== ROLES.ADMIN) {
      res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
      return;
    };

    UserCtrl.findByUsername(req.params.username).then((user) => {
      AppCtrl.findByAppId(req.params.appId).then((application) => {
        user.applications.push({
          id: application.id,
          name: application.name
        });

        //TODO: move this user save to user controller
        // save the user
        user.save((err) => {
          if (err) {
            // TODO: need to map mongo errors to user friendly error objects.
            console.log('user save err: \n');
            console.log(err);
            res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
          } else {
            res.status(200).json(user);
          }
        });
      }, (reason) => {
        if (reason === ReasonTexts.APP_NOT_FOUND) {
          res.status(404).send(new RouteUserError(ReasonTexts.APP_NOT_FOUND));
        } else {
          res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
        }
      });
    }, (reason) => {
      if (reason === ReasonTexts.USER_NOT_FOUND) {
        res.status(404).send(new RouteUserError(ReasonTexts.USER_NOT_FOUND));
      } else {
        res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
      }
    });
  });

  app.get('/users', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    if (req.user.role !== ROLES.ADMIN) {
      res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
      return;
    };

    UserCtrl.getAll(req.params.username).then((user) => {
      res.status(200).json(user);
    }, (reason) => {
      if (reason === ReasonTexts.USER_NOT_FOUND) {
        res.status(404).send(new RouteUserError(ReasonTexts.USER_NOT_FOUND));
      } else {
        res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
      }
    });
  });

  app.get('/user/:username', passport.authenticate('jwt', {
    session: false
  }), (req, res) => {
    if (req.params.username !== req.user.username && req.user.role !== ROLES.ADMIN) {
      res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
      return;
    };

    UserCtrl.findByUsername(req.params.username).then((user) => {
      res.status(200).json(user);
    }, (reason) => {
      if (reason === ReasonTexts.USER_NOT_FOUND) {
        res.status(404).send(new RouteUserError(ReasonTexts.USER_NOT_FOUND));
      } else {
        res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
      }
    });
  });

};
