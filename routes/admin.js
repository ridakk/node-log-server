"use strict";

let path = require('path');
let logsModel = require('./../models/logs');

module.exports = (app) => {

  app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname + './../ui/dist/index.html'));
  });

  app.get('/admin/logs', function(req, res) {
    res.status(200).send(logsModel.getAll());
  });

  app.put('/admin/logs/:id', function(req, res) {
    res.status(200).send(logsModel.update(req.params.id));
  });

  app.delete('/admin/logs/:id', function(req, res) {
    res.status(200).send(logsModel.remove(req.params.id));
  });

};
