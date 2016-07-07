let UserModel = () => {
  let token = null;
  let role = null;
  let username = null;
  let applications = null;

  return {
    set: (data) => {
      token = data.token;
      role = data.role;
      username = data.username;
      applications = data.applications;
    },
    getToken: () => {
      return token;
    },
    getRole: () => {
      return role;
    },
    getUsername: () => {
      return username;
    },
    getApplications: () => {
      return applications;
    },
    clear: () => {
      token = null;
      role = null;
      username = null;
    }
  };
};

export default new UserModel();
