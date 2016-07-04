let Api = () => {
  let token;
  return {
    auth: (username, password) => {
      fetch('/auth', {
          method: 'GET',
          headers: new Headers({
            'Authorization': 'Basic ' + btoa(username + ':' + password)
          })
        }).then((response) => {
          // Convert to JSON
          console.log('1', response)
          if (!response.ok) {
            return false;
          }
          return response.json();
        })
        .then((res) => {
          console.log("response", res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  };
};

export default new Api();
