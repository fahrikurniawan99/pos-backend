const Category = require("./model");
const { errorValidation } = require("../../utils");

const store = async (req, res, next) => {
  try {
    console.log(req.body);
    const payload = req.body;
    const category = new Category(payload);
    await category.save();
    res.status(201).json({
      data: category,
    });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const index = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const payload = req.body;
    
    const result = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await Category.findByIdAndRemove(req.params.id);
    res.send(200).json(result);
  } catch (error) {
    errorValidation(error, res, next);
  }
};

module.exports = {
  store,
  index,
  update,
  destroy,
};
