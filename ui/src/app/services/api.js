import session from '../models/session';

const Api = () => {
  function sendRequest(url, method, headers, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
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
    });
  }

  return {
    auth: (username, password) => {
      const auth = btoa(`${username}:${password}`);

      return sendRequest('/auth', 'GET', new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      }));
    },
    send: (url, method, data) =>
      sendRequest(url, method, new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `JWT ${session.get('token')}`,
      }), data),
  };
};

export default new Api();
