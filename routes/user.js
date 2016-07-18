"use strict";

let passport = require('passport');
let UserCtrl = require('../controllers/userController');
let AppCtrl = require('../controllers/applicationController');
let RouteUserError = require('../utils/routeUserError');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');
let config = require('../config');

module.exports = (app) => {

    app.post('/userdev', (req, res) => {
        if (!config.userdevApiEnabled) {
            res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
            return;
        }

        UserCtrl.create(req.body.username, req.body.password, ROLES.ADMIN).then((user) => {
            res.status(202).json(user);
        }, () => {
            res.status(500).send(new RouteUserError(ReasonTexts.UNKNOWN));
        });
    });

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
            res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
        });
    });

    app.post('/user/:username/:appId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        if (req.user.role !== ROLES.ADMIN) {
            res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
            return;
        };

        if (req.params.username === "undefined") {
            res.status(400).json(new RouteUserError(ReasonTexts.USERNAME_MANDATORY));
            return;
        };

        if (req.params.appId === "undefined") {
            res.status(400).json(new RouteUserError(ReasonTexts.APP_ID_MANDATORY));
            return;
        };

        AppCtrl.findByAppId(req.params.appId).then((application) => {
            UserCtrl.addAppId(req.params.username, application.id).then(() => {
                res.status(200).json({
                    status: 'ok'
                });
            }, (reason) => {
                res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteUserError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.delete('/user/:username/:appId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        if (req.user.role !== ROLES.ADMIN) {
            res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
            return;
        };

        AppCtrl.findByAppId(req.params.appId).then((application) => {
            UserCtrl.removeAppId(req.params.username, application.id).then(() => {
                res.status(200).json({
                    status: 'ok'
                });
            }, (reason) => {
                res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteUserError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
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
                res.status(404).json(new RouteUserError(ReasonTexts.USER_NOT_FOUND));
            } else {
                res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
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
                res.status(404).json(new RouteUserError(ReasonTexts.USER_NOT_FOUND));
            } else {
                res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.delete('/user/:username', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        if (req.params.username === req.user.username) {
            res.status(403).json(new RouteUserError(ReasonTexts.SELF_DELETE));
            return;
        };

        if (req.user.role !== ROLES.ADMIN) {
            res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
            return;
        };

        UserCtrl.delete(req.params.username).then((user) => {
            res.status(200).json({
              status: 'ok'
            });
        }, () => {
            res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
        });
    });

    app.get('/user/applications/:appId', passport.authenticate('jwt', {
      session: false
    }), (req, res) => {
      if (req.user.role !== ROLES.ADMIN) {
        res.status(403).json(new RouteUserError(ReasonTexts.NOT_AUTHORIZED));
        return;
      };

      AppCtrl.findByAppId(req.params.appId).then((application) => {

        UserCtrl.findByAppId(req.params.appId).then((users) => {
          res.status(200).json(users);
        }, (reason) => {
          res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
        });
      }, (reason) => {
        if (reason === ReasonTexts.APP_NOT_FOUND) {
          res.status(404).json(new RouteUserError(ReasonTexts.APP_NOT_FOUND));
        } else {
          res.status(500).json(new RouteUserError(ReasonTexts.UNKNOWN));
        }
      });
    });

};
