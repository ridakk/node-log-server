"use strict";

module.exports = (app) => {

  app.post('/auth',
    passport.authenticate('basic', {
      session: false
    }),
    function(req, res) {
      res.json({
        token: req.user.token
      });
    });

};
