const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup", verifySignUp.checkDuplicateEmail, controller.signup);
  app.post("/api/auth/signin", controller.signin);

  app.get("/verify-email", controller.verifyEmail);
  app.get("/reset-password", controller.verifyForgotPassword);

  app.post("/reset-password", controller.resetPassword);
  app.post("/forgot-password", controller.forgotPassword);
  app.post("/api/refresh-token", controller.refreshToken);

  app.get("/home", authJwt.verifyToken, (req, res) => {
    return res.status(200).send({ message: "nice" })
  })

};