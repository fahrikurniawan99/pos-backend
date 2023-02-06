const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const errorValidation = (error, res, next) => {
  if (error && error.name === "ValidationError") {
    res.status(500).json({
      error: 1,
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
      fields: error.errors,
    });
  } else {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = new User(payload);
    const result = await user.save();
    res.status(201).json({ data: result });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    return done(error, null);
  }
  done();
};

const login = (req, res, next) => {
  passport.authenticate("local", async (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(500)
        .json({ error: 1, message: "User or password incorect." });
    }
    const signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
    return res.status(200).json({ ...user, token: signed });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  const token = getToken(req);
  const user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!token || !user) {
    res.status(500).json({ error: 1, message: "User not found." });
  }

  return res.status(200).json({ message: "Logout success." });
};

const me = (req, res, next) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ error: 1, message: "You are not login or token expired" });
  }
  res.status(200).json({ data: req.user });
};

module.exports = { register, localStrategy, login, logout, me };
