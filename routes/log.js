"use strict";

let cors = require('cors');
let logsModel = require('./../models/logs');

module.exports = (app) => {

  let whitelist = ['https://sg1.genband.com', 'https://spidr-ucc.genband.com'];
  let corsOptions = {
    origin: (origin, callback) => {
      let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  };

  app.post('/log', cors(corsOptions), (req, res) => {
    res.status(200).send(logsModel.add(req.body));
  });

  app.get('/log/:id', cors(corsOptions), (req, res) => {
    let log = logsModel.get(req.params.id);
    res.status(200).send(log);
  });
};
