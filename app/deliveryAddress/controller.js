const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");
const DeliveryAddress = require("./model");

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

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = req.user;
    const deliveryAddress = new DeliveryAddress({ ...payload, user: user._id });
    const result = await deliveryAddress.save();
    return res.status(201).json({ data: result });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await DeliveryAddress.find({ user: req.user._id }).populate()
    return res.status(200).json(result);
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const update = async (req, res, next) => {
  try {
    const { _id, ...payload } = req.body;
    const address = await DeliveryAddress.findById(req.params.id);
    const subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    const policy = policyFor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res
        .status(401)
        .json({ error: 1, message: "You`re not modify this resoure." });
    }

    const result = await DeliveryAddress.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const destroy = async (req, res, next) => {
  try {
    const address = await DeliveryAddress.findById(req.params.id);
    const subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    const policy = policyFor(req.user);
    if (!policy.can("delete", subjectAddress)) {
      return res
        .status(401)
        .json({ error: 1, message: "You`re not modify this resoure." });
    }
    const result = await DeliveryAddress.findByIdAndDelete(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    errorValidation(error, res, next);
  }
};

module.exports = { store, index, update, destroy };
