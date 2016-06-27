'use strict'

let uuid = require('node-uuid');

let logs = [];

exports.add = function(content) {
  let log = {
    id: uuid.v1(),
    status: 'new',
    content: JSON.stringify(content)
  };

  logs.push(log);

  return log.id;
};

exports.get = function(id) {
  return logs.find(log => log.id > id);
};

exports.getAll = function() {
  return logs;
};

exports.update = function(log) {
  return log;
};

exports.remove = function(log) {
  return log;
};
