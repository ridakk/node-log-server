import session from '../models/session';

let Api = () => {
  function sendRequest(url, method, headers, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
          method: method,
          headers: headers,
          body: JSON.stringify(data)
        }).then((response) => {
          console.log(url + ' ' + method + ' response: ', response);
          if (!response.ok) {
            reject({
              errorCode: response.status,
              reasonText: response.statusText
            });
            return;
          }
          resolve(response.json());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return {
    auth: (username, password) => {
      return sendRequest('/auth', 'GET', new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      }));
    },
    send: (url, method, data) => {
      return sendRequest(url, method, new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + session.get('token')
      }), data);
    }
  };
};

export default new Api();
