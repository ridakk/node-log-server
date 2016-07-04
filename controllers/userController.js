"use strict";

let User = require('../models/user');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');

exports.findByUsername = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                console.log('user retrieve err: \n');
                console.log(err);
                reject(ReasonTexts.UNKNOWN);
                return;
            }

            if (!user) {
                reject(ReasonTexts.USER_NOT_FOUND);
                return;
            }

            resolve(user);
        });
    });
}

exports.create = (username, password, role) => {
    return new Promise((resolve, reject) => {
        let newUser = new User();

        newUser.username = username;
        newUser.password = newUser.generateHash(password);

        newUser.role = ROLES.GUEST;
        if (role === ROLES.ADMIN) {
            newUser.role = ROLES.ADMIN;
        }

        // save the user
        newUser.save((err) => {
            if (err) {
                // TODO: need to map mongo errors to user friendly error objects.
                console.log('user create err: \n');
                console.log(err);
                reject(ReasonTexts.UNKNOWN);
            } else {
                resolve(newUser);
            }
        });
    });
}
