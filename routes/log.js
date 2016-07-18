"use strict";

let cors = require('cors');
let CorsCtrl = require('../controllers/corsController');
let AppCtrl = require('../controllers/applicationController');
let LogCtrl = require('../controllers/logController');
let passport = require('passport');
let RouteLogError = require('../utils/routeLogError');

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

    app.get('/log/:appId', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByAppId(req.params.appId).then((application) => {
            if (application.createdBy !== req.user.username &&
                req.user.applications.indexOf(application.id) === -1 &&
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new RouteAppError(ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            LogCtrl.findBy({
                applicationId: req.params.appId
            }).then((logs) => {
                res.status(202).json(logs);
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
                res.status(403).json(new RouteAppError(ReasonTexts.NOT_AUTHORIZED));
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
};
