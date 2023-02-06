const router = require("express").Router();
const controller = require("./controller");
const passport = require("passport");
const { decodeToken } = require("../../middlewares");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email" }, controller.localStrategy)
);

router.post("/register", decodeToken(), controller.register);
router.post("/login", decodeToken(), controller.login);
router.post("/logout", decodeToken(), controller.logout);
router.get("/me", decodeToken(), controller.me);

module.exports = router;
