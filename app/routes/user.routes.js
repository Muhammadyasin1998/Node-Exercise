
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.post('/api/v1/create/user', controller.createUser);
  app.post('/api/v1/users/generate_otp', controller.generateOTP);
  app.get('/api/v1/users/:id/verify_otp', controller.verifyOTP);

};
