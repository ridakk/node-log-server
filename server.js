"use strict";

const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const helmet = require('helmet')
const compression = require('compression');
const uiDistPath = path.resolve(__dirname, 'ui/dist/');

console.log('env: ' + process.env.NODE_ENV);
console.log('port: ' + process.env.PORT);
console.log('__dirname: ' + __dirname);
console.log('uiDistPath: ' + uiDistPath);

mongoose.connect(config.database);

app.set('superSecret', config.secret);
app.set('port', (process.env.PORT || 8443));

app.use(helmet());
app.use(compression());
app.use(express.static(uiDistPath));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(morgan('dev'));

// load auth strategies
require('./auth/logApiStrategy')(app);
require('./auth/userLoginStrategy')(app);
require('./auth/jwtStrategy')(app);

require('./routes/log')(app);
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/application')(app);
require('./routes/key')(app);

if (process.env.NODE_ENV !== 'production') {
    let credentials = {
      key: fs.readFileSync(config.key, 'utf8'),
      cert: fs.readFileSync(config.cert, 'utf8'),
      passphrase: config.passphrase
    };

    let https = require('https');
    let httpsServer = https.createServer(credentials, app);

    httpsServer.listen(app.get('port'), () => {
      console.log('Node https app is running on port', app.get('port'));
    });
} else {
    let http = require('http');
    let httpServer = http.createServer(app);

    httpServer.listen(app.get('port'), () => {
      console.log('Node http app is running on port', app.get('port'));
    });
}
