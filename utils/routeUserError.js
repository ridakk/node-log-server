const Error = require('../utils/error');
const ErrorCodes = require('../constants/errorCodes.js');

const RouteKeyError = (reasonText) =>
  new Error(ErrorCodes.ROUTE_KEY, reasonText);

module.exports = RouteKeyError;
