"use strict";

let User = require('../models/user');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');
let ROLES = require('../constants/roles.js');

const USER_FILTER = {
  _id: 0,
  username: 1,
  role: 1,
  applications: 1
};

const USERNAME_FILTER = {
  _id: 0,
  username: 1
};

exports.findByUsername = (username, filter) => {
  console.log('UserCtrl.findByUsername' + username);
  return new Promise((resolve, reject) => {
    console.log('UserCtrl.findOne' + username);
    User.findOne({
      username: username
    }, filter ? filter : USER_FILTER, (err, user) => {
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

exports.findByAppId = (appId) => {
  console.log('UserCtrl.findByAppId' + appId);
  return new Promise((resolve, reject) => {
    User.find({
      applications: {
        "$in": [appId]
      }
    }, USERNAME_FILTER, (err, users) => {
      if (err) {
        console.log('UserCtrl user retrieve err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }

      if (!users) {
        console.log('UserCtrl users with appId not found: ');
        resolve([]);
        return;
      }

      console.log('UserCtrl users:\n');
      console.log(users);
      resolve(users);
    });
  });
}

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    User.find({}, USER_FILTER, (err, users) => {
      if (err) {
        console.log('user retrieve err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }

      if (!users) {
        reject(ReasonTexts.USER_NOT_FOUND);
        return;
      }

      resolve(users);
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

exports.delete = (username) => {
  return new Promise((resolve, reject) => {
    User.remove({
      username: username
    }, (err, username) => {
      if (err) {
        console.log('username remove err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }
      else {
        resolve();
      }
    });
  });
}

exports.addAppId = (username, appId) => {
  return new Promise((resolve, reject) => {
    User.update({
      username: username
    }, {
      $addToSet: {
        applications: appId
      }
    }, (err) => {
      if (err) {
        // TODO: need to map mongo errors to user friendly error objects.
        console.log('app id add err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
      } else {
        resolve();
      }
    })
  });
}

exports.removeAppId = (username, appId) => {
  return new Promise((resolve, reject) => {
    User.update({
      username: username
    }, {
      $pull: {
        applications: appId
      }
    }, (err) => {
      if (err) {
        // TODO: need to map mongo errors to user friendly error objects.
        console.log('app id remove err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
      } else {
        resolve();
      }
    })
  });
}
