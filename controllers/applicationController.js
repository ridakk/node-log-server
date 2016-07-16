"use strict";

let Application = require('../models/application');
let uuid = require('node-uuid');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');

const APPLICATION_FILTER = {
  _id: 0
};

exports.findByAppId = (appid) => {
  return new Promise((resolve, reject) => {
    Application.findOne({
      id: appid
    }, APPLICATION_FILTER, (err, application) => {
      if (err) {
        console.log('application retrieve err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }

      if (!application) {
        reject(ReasonTexts.APP_NOT_FOUND);
        return;
      }

      resolve(application);
    });
  });
}

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    Application.find({}, APPLICATION_FILTER, (err, applications) => {
      if (err) {
        console.log('application retrieve err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }

      if (!applications) {
        reject(ReasonTexts.APP_NOT_FOUND);
        return;
      }

      resolve(applications);
    });
  });
}

exports.create = (name, url, createdBy) => {
  return new Promise((resolve, reject) => {
    let newApplication = new Application();

    newApplication.id = uuid.v1();
    newApplication.name = name;
    newApplication.url = url;
    newApplication.createdBy = createdBy;

    console.log('new app: \n');
    console.log(newApplication);

    // save the user
    newApplication.save((err) => {
      if (err) {
        // TODO: need to map mongo errors to user friendly error objects.
        // 11000 means duplicate key
        console.log('application create err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
      } else {
        resolve(newApplication);
      }
    });
  });
}
