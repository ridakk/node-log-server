"use strict";

let cors = require('cors');
let CorsCtrl = require('../controllers/corsController');
let passport = require('passport');

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
        res.status(200).json({
            status: 'ok'
        });
    });
};
