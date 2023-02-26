const { getToken, policyFor } = require("../utils/index");
const jwt = require("jsonwebtoken");
const config = require("../app/config");
const User = require("../app/user/model");

const decodeToken = () => {
  return async function (req, res, next) {
    try {
      const token = getToken(req);
      if (!token) return next();

      req.user = jwt.verify(token, "fahri");

      const user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res.status(500).json({
          error: 1,
          message: "Token Expired",
        });
      }
    } catch (error) {
      console.log(error);

      next(error);
    }
    next();
  };
};

// middleware untuk cek hak askes
function police_check(action, subject) {
  return function (req, res, next) {
    const policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.status(500).json({
        error: 1,
        message: `You are not allowed to ${action} ${subject} `,
      });
    }
    next();
  };
}

module.exports = { decodeToken, police_check };
