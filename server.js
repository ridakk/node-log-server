"use strict";

let express = require('express');
let fs = require('fs');
let app = express();
let bodyParser = require('body-parser');
let https = require('https');

let privateKey = fs.readFileSync('server.key', 'utf8');
let certificate = fs.readFileSync('server.crt', 'utf8');

let credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: 'odun'
};

app.set('port', (process.env.PORT || 8443));

app.use(express.static(__dirname + '/ui/dist/'));
app.use(bodyParser.json());

require('./routes/log')(app);
require('./routes/admin')(app);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
