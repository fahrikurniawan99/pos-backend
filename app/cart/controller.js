const Product = require("../product/model");
const CartItem = require("../cart_item/model");

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

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const cartItems = items.map((item) => {
      const relatedProduct = products.find(
        (product) => product._id.toString() === item.product
      );
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });
    console.log(req.user._id);
    console.log("deleteMany");

    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );
    console.log("write");

    return res.status(200).json({ data: cartItems });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const index = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );
    return res.status(200).json({ data: items });
  } catch (error) {}
};

module.exports = { index, update };
