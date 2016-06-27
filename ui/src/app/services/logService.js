const jquery = require('jquery');

export default class LogService {
  constructor() {

  }

  static getAll(params) {
    return new Promise((resolve, reject) => {
      jquery.get('/admin/logs').then((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      })
    });
  }
}
