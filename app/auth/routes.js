const router = require("express").Router();
const controller = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email" }, controller.localStrategy)
);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", controller.me);

module.exports = router;
