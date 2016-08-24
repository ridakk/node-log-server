'use strict'

module.exports = {
  DEFAULT: {
    _id: 0,
    applicationId: 0,
    version: 0,
    config: 0,
    reporter: 0,
    log: 0,
    screenShot: 0,
    date: 0,
  },
  LOG_ONLY: {
    _id: 0,
    log: 1,
  },
  SCREENSHOT_ONLY: {
    _id: 0,
    screenShot: 1,
  },
  CONFIG_ONLY: {
    _id: 0,
    config: 1,
  },
  ALL: {
    _id: 0,
    applicationId: 0,
  },
}
