"use strict";

let passport = require('passport');
let AppCtrl = require('../controllers/applicationController');
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


            AppCtrl.create(req.body.name, req.body.url, req.user.username).then((application) => {
                res.status(202).json(application);
            }, (reason) => {
                res.status(500).send(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.UNKNOWN));
            });
        }
    );

    app.get('/application/:id', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        AppCtrl.findByUsername(req.params.id).then((application) => {
            if (application.createdBy !== req.user.username ||
                req.user.applications.indexOf(application.id) === -1 ||
                req.user.role !== ROLES.ADMIN) {
                res.status(403).json(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.NOT_AUTHORIZED));
                return;
            }

            res.status(200).json(application);
        }, (reason) => {
            if (reason === ReasonTexts.USER_NOT_FOUND) {
                res.status(404).send(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.APP_NOT_FOUND));
            } else {
                res.status(500).send(new Error(ErrorCodes.ROUTE_APPLICATION, ReasonTexts.UNKNOWN));
            }
        });
    });

};
