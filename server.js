"use strict";

let express = require('express');
let fs = require('fs');
let app = express();
let bodyParser = require('body-parser');
let https = require('https');
let morgan = require('morgan');
let mongoose = require('mongoose');
let config = require('./config');

let privateKey = fs.readFileSync('server.key', 'utf8');
let certificate = fs.readFileSync('server.crt', 'utf8');

let credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: 'odun'
};

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.set('port', (process.env.PORT || 8443));

app.use(express.static(__dirname + '/ui/dist/'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// load auth strategies
require('./auth/logApiStrategy')(app);
require('./auth/userLoginStrategy')(app);
require('./auth/JwtStrategy')(app);

require('./routes/log')(app);
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/application')(app);
require('./routes/key')(app);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
