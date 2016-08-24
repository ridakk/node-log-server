"use strict";

let cors = require('cors');
let CorsCtrl = require('../controllers/corsController');
let AppCtrl = require('../controllers/applicationController');
let LogCtrl = require('../controllers/logController');
let passport = require('passport');
let RouteLogError = require('../utils/routeLogError');
let LogFilters = require('../constants/logFilters.js');
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

module.exports = (app) => {

    var corsOptionsDelegate = function(req, callback) {
        CorsCtrl.getWhiteListOfApp(req.params.appId).then((whitelist) => {
            console.log(whitelist)
            let corsOptions;
            if (whitelist.has(req.header('Origin'))) {;
                corsOptions = {
                    origin: true
                }; // reflect (enable) the requested origin in the CORS response
            } else {
                corsOptions = {
                    origin: false
                }; // disable CORS for this request
            }
            callback(null, corsOptions);
        });
    };

    app.options('/log/:appId', cors({
        "methods": "POST"
    }));
    app.post('/log/:appId', cors(corsOptionsDelegate), passport.authenticate('log-api', {
        session: false
    }), (req, res) => {
      LogCtrl.create(req.params.appId, req.body).then((data) => {
          res.status(202).json(data);
      }, () => {
          res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
      });
    });

    app.get('/log/:appId/analytics', passport.authenticate('jwt', {
      session: false
    }), (req, res) => {
      AppCtrl.findByAppId(req.params.appId).then((application) => {
        if (application.createdBy !== req.user.username &&
          req.user.applications.indexOf(application.id) === -1 &&
          req.user.role !== ROLES.ADMIN) {
          res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
          return;
        }

        LogCtrl.getAnaltics(application.id).then((analytics) => {
          res.status(200).json(analytics);
        }, (reason) => {
          res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
        });
      }, (reason) => {
        if (reason === ReasonTexts.APP_NOT_FOUND) {
          res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
        } else {
          res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
        }
      });
    });

    app.get('/log/:appId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: req.params.appId
            }).then((logs) => {
                res.status(200).json(logs);
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.get('/log/:appId/:logId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: application.id,
                id: req.params.logId
            }).then((logs) => {
                res.status(200).json(logs);
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.delete('/log/:appId/:logId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            console.log(1);
            LogCtrl.remove({
                applicationId: application.id,
                id: req.params.logId
            }).then((logs) => {
                res.status(200).json({
                    status: 'ok',
                });
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.get('/log/:appId/:logId/all', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: application.id,
                id: req.params.logId
            }, LogFilters.ALL).then((logs) => {
                res.status(200).json(logs);
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.get('/log/:appId/:logId/log', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: application.id,
                id: req.params.logId
            }, LogFilters.LOG_ONLY).then((logs) => {
                res.status(200).json(logs);
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.get('/log/:appId/:logId/screenShot', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: application.id,
                id: req.params.logId
            }, LogFilters.SCREENSHOT_ONLY).then((logs) => {
                res.status(200).json(logs);
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.get('/log/:appId/:logId/config', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: application.id,
                id: req.params.logId
            }, LogFilters.CONFIG_ONLY).then((logs) => {
                res.status(200).json(logs);
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });

    app.put('/log/:appId/:logId/status', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteLogError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.update({
              applicationId: application.id,
              id: req.params.logId,
            }, {
              status: req.body.status,
            }).then(() => {
                res.status(200).json({
                    status: 'ok',
                });
            }, () => {
                res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
            });
        }, (reason) => {
            if (reason === ReasonTexts.APP_NOT_FOUND) {
                res.status(404).json(new RouteLogError(ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).json(new RouteLogError(ReasonTexts.UNKNOWN));
            }
        });
    });
};
