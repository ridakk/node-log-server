'use strict'

let Error = require('../utils/error');
let ErrorCodes = require('../constants/errorCodes.js');

let RouteApplicationError = function(reasonText) {
  return new Error(ErrorCodes.ROUTE_APPLICATION, reasonText);
}

module.exports = RouteApplicationError;
