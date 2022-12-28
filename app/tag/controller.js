const Tag = require("./model");
const Category = require("../category/model");
const { errorValidation } = require("../../utils");

const store = async (req, res, next) => {
  try {
    const payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category },
      });
      if (!category)
        return res
          .status(404)
          .json({ error: 1, message: "category not found" });
      payload.category = category._id;
    }

    const tag = new Tag(payload);
    await tag.save();
    res.status(201).json({
      data: tag,
    });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const index = async (req, res, next) => {
  try {
    if (req.query.category) {
      const category = await Category.findOne({
        name: { $regex: req.query.category },
      });
      const tags = await Tag.find({ category: category._id }).populate(
        "category"
      );
      return res.json({ data: tags });
    }
    const tag = await Tag.find();
    res.status(200).json({ data: tag });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await Tag.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.send(200).json({ data: result });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await Tag.findByIdAndRemove(req.params.id);
    res.send(200).json({ data: result });
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
