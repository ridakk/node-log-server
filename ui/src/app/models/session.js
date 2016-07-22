const Session = () => {
  let data = {};

  return {
    set: (key, value) => {
      data[key] = value;
    },
    get: (key) =>
      data[key],
    clear: () => {
      data = {};
    },
  };
};

export default new Session();
