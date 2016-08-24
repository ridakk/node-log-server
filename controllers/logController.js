"use strict";

let Log = require('../models/log');
let uuid = require('node-uuid');
let Promise = require('es6-promise').Promise;
let ReasonTexts = require('../constants/reasonTexts.js');
let LogStatus = require('../constants/logStatus.js');
let LogAnalytics = require('../constants/logAnalytics.js');
let LogFilters = require('../constants/logFilters.js');


exports.findBy = (criteria, filter) => {
  return new Promise((resolve, reject) => {
    let mongoFilter = filter ? filter : LogFilters.DEFAULT;
    Log.find(criteria, mongoFilter, (err, logs) => {
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

      if (mongoFilter === LogFilters.ALL) {
        let len = logs.length;
        for (let i = 0; i < len; i++) {
            let log = logs[i];
            if (log.log) {
                log.log = true;
            }
            if (log.screenShot) {
                log.screenShot = true;
            }
            if (log.config) {
                log.config = true;
            }
        }
      }

      resolve(logs);
    });
  });
}

exports.update = (selector, data) => {
  return new Promise((resolve, reject) => {
    Log.update(selector, {
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

exports.remove = (selector, logId) => {
  return new Promise((resolve, reject) => {
    Log.remove(selector, (err) => {
      if (err) {
        console.log('log delete err: \n');
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
    newLog.date = new Date();

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

function aggregate(query, identifier) {
  console.log(1111)
    return new Promise((resolve, reject) => {
        Log.aggregate(query,
            (err, result) => {
                if (err) {
                    // TODO: need to map mongo errors to user friendly error objects.
                    console.log('log analytics err: \n');
                    console.log(err);
                    console.log(err.code);
                    reject(ReasonTexts.UNKNOWN);
                } else {
                    console.log(2222)
                    resolve({
                      [identifier]:result
                    });
                }
            });
    });
}

function getCreationCounts(appId) {
    return aggregate([{
        $match: {
            applicationId: appId,
        },
    }, {
        $sort: {
            date: 1,
        },
    }, {
        $group: {
            _id: {
                date: {
                    $week: "$date",
                },
            },
            count: {
                $sum: 1,
            },
        },
    }], LogAnalytics.ISSUE_CREATION_COUNT);
}

function getReporterCounts(appId) {
    return aggregate([{
        $match: {
            applicationId: appId,
        },
    }, {
        $group: {
            _id: '$reporter',
            count: {
                $sum: 1,
            },
        },
    }], LogAnalytics.REPORTER_COUNT);
}

function getPlatfromCounts(appId) {
  return aggregate([{
      $match: {
          applicationId: appId,
      },
  }, {
      $group: {
          _id: '$platform',
          count: {
              $sum: 1,
          },
      },
  }], LogAnalytics.PLATFORM_COUNT);
}

function getStatusCounts(appId) {
  return aggregate([{
      $match: {
          applicationId: appId,
      },
  }, {
      $group: {
          _id: '$status',
          count: {
              $sum: 1,
          },
      },
  }], LogAnalytics.STATUS_COUNT);
}

exports.getAnaltics = (appId) => {
    return new Promise((resolve, reject) => {
        let result = {};

        Promise.all([
            getCreationCounts(appId),
            getReporterCounts(appId),
            getPlatfromCounts(appId),
            getStatusCounts(appId)
        ]).then((data) => {
            let i = 0;
            for (i in data) {
                Object.assign(result, data[i]);
            }
            resolve(result);
        }, (err) => {
            reject(ReasonTexts.UNKNOWN);
        })
    });
}
