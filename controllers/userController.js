"use strict";

let User = require('../models/user');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');

exports.findByUsername = (username) => {
  console.log('UserCtrl.findByUsername' + username);
    return new Promise((resolve, reject) => {
      console.log('UserCtrl.findOne' + username);
        User.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                console.log('UserCtrl user retrieve err: \n');
                console.log(err);
                console.log(err.code);
                reject(ReasonTexts.UNKNOWN);
                return;
            }

            if (!user) {
              console.log('UserCtrl user not found: ');
              console.log(ReasonTexts.USER_NOT_FOUND + '...\n');
                reject(ReasonTexts.USER_NOT_FOUND);
                return;
            }

            console.log('UserCtrl user:\n');
            console.log(user);
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
                console.log(err.code);
                reject(ReasonTexts.UNKNOWN);
            } else {
                resolve(newUser);
            }
        });
    });
}
