"use strict";

let cors = require('cors');
let CorsCtrl = require('../controllers/corsController');
let LogCtrl = require('../controllers/logController');
let passport = require('passport');
let RouteLogError = require('../utils/routeLogError');

module.exports = (app) => {

    var corsOptionsDelegate = function(req, callback) {
        CorsCtrl.getWhiteListOfApp(req.params.appId).then((whitelist) => {
            console.log(whitelist)
            let corsOptions;
            if (whitelist.has(req.header('Origin'))) {;
                corsOptions = {
                    origin: true
                }; // reflect (enable) the requested origin in the CORS response
            } else {
                corsOptions = {
                    origin: false
                }; // disable CORS for this request
            }
            callback(null, corsOptions);
        });
    };

    app.options('/log/:appId', cors());
    app.post('/log/:appId', cors(corsOptionsDelegate), passport.authenticate('log-api', {
        session: false
    }), (req, res) => {
      LogCtrl.create(req.params.appId, req.body).then((data) => {
          res.status(202).json(data);
      }, () => {
          res.status(500).send(new RouteLogError(ReasonTexts.UNKNOWN));
      });
    });
};
