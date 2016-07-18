'use strict'

let Error = require('../utils/error');
let ErrorCodes = require('../constants/errorCodes.js');

let RouteLogError = function(reasonText) {
  return new Error(ErrorCodes.ROUTE_LOG, reasonText);
}

module.exports = RouteLogError;
