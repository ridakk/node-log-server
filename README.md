# node-log-server
simple key value storage

[![Dependency Status](https://david-dm.org/ridakk/node-log-server.svg?theme=shields.io)](https://david-dm.org/ridakk/node-log-server)
[![devDependency Status](https://david-dm.org/ridakk/node-log-server/dev-status.svg?theme=shields.io)](https://david-dm.org/ridakk/node-log-server#info=devDependencies)

Posting logs:

```JavaScript
    fetch('https://oddlogz.com:443/log/<app-id>', {
        method: 'POST',
        Authorization: 'Basic ' + btoa('<ProductKey>:<JsKey>'),
        body: JSON.stringify({
            platform: <navigator.userAgent>,
            version: <app version>,
            config: <config-file>,
            reporter: <reporter-username or id>,
            description: <issue-description>,
            log: <log-file>,
            screenShot: <screen-capture>
        })
    }).then((response) => {
        if (!response.ok) {
            reject({
                errorCode: response.status,
                reasonText: response.statusText,
            });
            return;
        }
        resolve(response.json());
    })
    .catch((err) => {
        reject(err);
    });
```

