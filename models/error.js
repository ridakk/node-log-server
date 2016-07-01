'use strict'

class Error {
    constructor (errorCode, reasonText) {
        this.errorCode = errorCode;
        this.reasonText = reasonText;
    }
}

module.exports = Error;
