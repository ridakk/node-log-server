'use strict'

let Error = function(errorCode, reasonText) {
  console.log(errorCode)
  return {
    errorCode: errorCode,
    reasonText: reasonText
  }
}

module.exports = Error;
