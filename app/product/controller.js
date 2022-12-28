const Product = require("./model");
const fs = require("fs");
const { rootPath } = require("../config");
const Category = require("../category/model");
const Tag = require("../tag/model");
const { errorValidation } = require("../../utils");

// store : create product
const store = async (req, res, next) => {
  try {
    let payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      const tags = await Tag.find({
        name: { $in: payload.tags },
      });
      if (tags) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      const { filename, originalname, path } = req.file;
      const tmp_path = path;
      const originalnameArray = originalname.split(".");
      const originalExtension = originalnameArray[originalnameArray.length - 1];
      const name = `${filename}.${originalExtension}`;
      const target_path = `${rootPath}/public/images/products/${name}`;

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          const product = new Product({
            ...payload,
            image_url: `http://localhost:4000/images/products/${name}`,
          });
          await product.save();
          res.status(201).json({ data: product });
        } catch (error) {
          fs.unlinkSync(target_path);
          errorValidation(error, res, next);
        }
      });
    } else {
      const product = new Product(payload);
      await product.save();
      res.status(201).json({ data: product });
    }
  } catch (error) {
    errorValidation(error, res, next);
  }
};

// index : get product
const index = async (req, res, next) => {
  try {
    const { limit = 0, skip = 0, q = "", category = "", tags = [] } = req.query;

    let criteria = "";

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: q, $options: "i" },
      };
    }

    if (category.length) {
      const result = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });

      if (result) {
        criteria = {
          ...criteria,
          category: result._id,
        };
      }
    }

    if (tags.length) {
      const result = await Tag.find({
        name: { $in: tags },
      });
      criteria = { ...criteria, tags: { $in: result.map((tag) => tag._id) } };
    }

    let result = "";

    const count = await Product.find().countDocuments();

    if (criteria) {
      result = await Product.find(criteria)
        .limit(limit)
        .skip(skip)
        .populate("category")
        .populate("tags");
    } else {
      result = await Product.find()
        .limit(limit)
        .skip(skip)
        .populate("category")
        .populate("tags");
    }
    res.status(200).json({ data: result, count });
  } catch (error) {
    next(error);
  }
};

// update : update product
const update = async (req, res, next) => {
  try {
    let payload = req.body;

    if (payload.category) {
      const category = await Category.find({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      const tags = await Tag.find({
        name: { $in: payload.tags },
      });
      if (tags) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      const { filename, originalname, path } = req.file;
      const tmp_path = path;
      const originalnameArray = originalname.split(".");
      const originalExtension = originalnameArray[originalnameArray.length - 1];
      const name = `${filename}.${originalExtension}`;
      const target_path = `${rootPath}/public/images/products/${name}`;

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          const { image_url } = await Product.findById(req.params.id);
          const currentImage = `${rootPath}/public/images/products/${image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          const product = {
            ...payload,
            image_url: name,
          };
          const result = await Product.findByIdAndUpdate(
            req.params.id,
            product,
            { new: true, runValidators: true }
          );
          res.send(200, result);
        } catch (error) {
          fs.unlinkSync(target_path);
          errorValidation(error, res, next);
        }
      });
    } else {
      const product = payload;
      const result = await Product.findByIdAndUpdate(req.params.id, product, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ data: result });
    }
  } catch (error) {
    errorValidation(error, res, next);
  }
};

// destroy : delete product
const destroy = async (req, res, next) => {
  try {
    const result = await Product.findByIdAndRemove(req.params.id);
    const currentImage = `${rootPath}/public/images/products/${result.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    res.send(200).json(result);
  } catch (error) {
    next(error);
  }
};

// export controller
module.exports = {
  store,
  index,
  update,
  destroy,
};
