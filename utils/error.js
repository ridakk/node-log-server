'use strict'

let Error = function(errorCode, reasonText) {
  return {
    errorCode: errorCode,
    reasonText: reasonText
  }
}

module.exports = Error;
