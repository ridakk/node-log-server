"use strict";

let Log = require('../models/log');
let uuid = require('node-uuid');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');
let LogStatus = require('../constants/LogStatus.js');

const LOG_FILTER = {
  _id: 0
};

exports.findBy = (criteria) => {
  return new Promise((resolve, reject) => {
    Log.find(criteria, LOG_FILTER, (err, logs) => {
      if (err) {
        console.log('logs retrieve err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
        return;
      }

      if (!logs) {
        resolve([]);
        return;
      }

      resolve(logs);
    });
  });
}

exports.update = (appid, data) => {
  return new Promise((resolve, reject) => {
    Log.update({
      applicationId: appid
    }, {
      $set: data
    }, (err) => {
      if (err) {
        console.log('log update err: \n');
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

exports.create = (appId, data) => {
  return new Promise((resolve, reject) => {
    let newLog = new Log();

    Object.assign(newLog, data);

    newLog.id = uuid.v4();
    newLog.applicationId = appId;
    newLog.status = LogStatus.NEW;

    // save the log
    newLog.save((err) => {
      if (err) {
        // TODO: need to map mongo errors to user friendly error objects.
        console.log('new log create err: \n');
        console.log(err);
        console.log(err.code);
        reject(ReasonTexts.UNKNOWN);
      } else {
        resolve({
          id: newLog.id
        });
      }
    });
  });
}
