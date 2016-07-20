"use strict";

let express = require('express');
let fs = require('fs');
let app = express();
let bodyParser = require('body-parser');
let https = require('https');
let morgan = require('morgan');
let mongoose = require('mongoose');
let config = require('./config');
let helmet = require('helmet')
let h5bp = require('h5bp');
let compression = require('compression');

console.log('env: ' + process.env.NODE_ENV);
console.log('port: ' + process.env.PORT);

let credentials = {
  key: fs.readFileSync(config.key, 'utf8'),
  cert: fs.readFileSync(config.cert, 'utf8')
};

if (process.env.NODE_ENV !== 'production') {
    credentials.passphrase = config.passphrase;
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        skip: function(req, res) {
            return res.statusCode < 400
        }
    }));
}

mongoose.connect(config.database);

app.set('superSecret', config.secret);
app.set('port', (process.env.PORT || 8443));

app.use(helmet());
app.use(h5bp({ root: __dirname + '/ui/dist/' }));
app.use(compression());
app.use(express.static(__dirname + '/ui/dist/'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({limit: '5mb'}));

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
