const Error = require('../utils/error');
const ErrorCodes = require('../constants/errorCodes.js');

const RouteApplicationError = (reasonText) =>
  new Error(ErrorCodes.ROUTE_APPLICATION, reasonText);

module.exports = RouteApplicationError;
