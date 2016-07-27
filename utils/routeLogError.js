const Error = require('../utils/error');
const ErrorCodes = require('../constants/errorCodes.js');

const RouteLogError = (reasonText) =>
  new Error(ErrorCodes.ROUTE_LOG, reasonText);

module.exports = RouteLogError;
