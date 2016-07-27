const Error = require('../utils/error');
const ErrorCodes = require('../constants/errorCodes.js');

const RouteUserError = (reasonText) =>
  new Error(ErrorCodes.ROUTE_USER, reasonText);

module.exports = RouteUserError;
