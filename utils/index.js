const { AbilityBuilder, Ability } = require("@casl/ability");

const getToken = (req) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  return token && token.length ? token : null;
};

const policies = {
  guest(user, { can }) {
    can("read", "products");
  },
  user(user, { can }) {
    can("view", "Order");
    can("create", "Order");
    can("read", "Order", { user_id: user._id });
    can("update", "User", { _id: user._id });
    can("read", "Cart", { user_id: user._id });
    can("update", "Cart", { user_id: user._id });
    can("view", "DeliveryAddress");
    can("create", "DeliveryAddress", { user_id: user._id });
    can("update", "DeliveryAddress", { user_id: user._id });
    can("delete", "DeliveryAddress", { user_id: user._id });
    can("read", "Invoice", { user_id: user._id });
  },
  admin(user, { can }) {
    can("manage", "all");
  },
};

const policyFor = (user) => {
  const builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }
  return new Ability(builder.rules);
};

const errorValidation = (error, res, next) => {
  if (error && error.name === "ValidationError") {
    res.send(500, {
      error: 1,
      message: error.message,
      fields: error.errors,
    });
  } else {
    next(error);
  }
};

module.exports = { getToken, policyFor, errorValidation };
