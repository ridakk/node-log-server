"use strict";

let AppCtrl = require('../controllers/applicationController');
let Promise = require('es6-promise').Promise;

let whiteList = new Map();

exports.getWhiteListOfApp = (appId) => {
  return new Promise((resolve, reject) => {
    let cachedWhiteList = whiteList.get(appId);
    if (cachedWhiteList) {
      resolve(cachedWhiteList);
      return;
    }

    cachedWhiteList = new Set();
    AppCtrl.findByAppId(appId).then((application) => {
      cachedWhiteList.add(application.url);
      whiteList.set(appId, cachedWhiteList);
      resolve(cachedWhiteList);
    }, () => {
      whiteList.set(appId, cachedWhiteList);
      resolve(cachedWhiteList);
    });
  });
}

exports.addUrlToWhiteListOfApp = (appId, url) => {
  let cachedWhiteList = whiteList.get(appId);
  if (!cachedWhiteList) {
    cachedWhiteList = new Set();
  }

  cachedWhiteList.add(url);
  whiteList.set(appId, cachedWhiteList);
}
