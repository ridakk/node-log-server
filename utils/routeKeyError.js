'use strict'

let Error = require('../utils/error');
let ErrorCodes = require('../constants/errorCodes.js');

let RouteUserError = function(reasonText) {
  return new Error(ErrorCodes.ROUTE_USER, reasonText);
}

module.exports = RouteUserError;
