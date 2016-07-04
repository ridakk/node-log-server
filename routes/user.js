"use strict";

let passport = require('passport');
let UserCtrl = require('../controllers/userController');
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
    //   newUser.role = ROLES.ADMIN;
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

    app.get('/userx/:username', (req, res) => {
        UserCtrl.findByUsername(req.params.username).then((user) => {
            res.status(200).json(user);
        }, (reason) => {
            if (reason === ReasonTexts.USER_NOT_FOUND) {
                res.status(404).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.USER_NOT_FOUND));
            } else {
                res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
            }
        });
    });

    app.post('/user', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
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

        UserCtrl.create(req.body.username, req.body.password, req.body.role).then((user) => {
            res.status(202).json(user);
        }, (reason) => {
            res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
        });
    });

    app.put('/user/:username', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        if (req.user.role !== ROLES.ADMIN) {
            res.status(403).json(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.NOT_AUTHORIZED));
            return;
        };

        UserCtrl.findByUsername(req.params.username).then((user) => {
            AppCtrl.findByUsername(req.params.id).then((application) => {
                user.applications.push(application.id);

                // save the user
                user.save((err) => {
                    if (err) {
                        // TODO: need to map mongo errors to user friendly error objects.
                        console.log('user save err: \n');
                        console.log(err);
                        res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
                    } else {
                        res.status(200).json(user);
                    }
                });
            }, (reason) => {
                if (reason === ReasonTexts.USER_NOT_FOUND) {
                    res.status(404).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.APP_NOT_FOUND));
                } else {
                    res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
                }
            });
        }, (reason) => {
            if (reason === ReasonTexts.USER_NOT_FOUND) {
                res.status(404).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.USER_NOT_FOUND));
            } else {
                res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
            }
        });
    });

    app.get('/user/:username', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        if (req.params.username !== req.user.username || req.user.role !== ROLES.ADMIN) {
            res.status(403).json(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.NOT_AUTHORIZED));
            return;
        };

        UserCtrl.findByUsername(req.params.username).then((user) => {
            res.status(200).json(user);
        }, (reason) => {
            if (reason === ReasonTexts.USER_NOT_FOUND) {
                res.status(404).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.USER_NOT_FOUND));
            } else {
                res.status(500).send(new Error(ErrorCodes.ROUTE_USER, ReasonTexts.UNKNOWN));
            }
        });
    });

};
