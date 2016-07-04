'use strict'

let Error = require('../utils/error');
let ErrorCodes = require('../constants/errorCodes.js');

let RouteKeyError = function(reasonText) {
  return new Error(ErrorCodes.ROUTE_KEY, reasonText);
}

module.exports = RouteKeyError;
