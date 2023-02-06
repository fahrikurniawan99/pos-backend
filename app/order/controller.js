const { Types } = require("mongoose");
const CartItem = require("../cart_item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("../order/model");
const OrderItems = require("../order_item/model");

const errorValidation = (error, res, next) => {
  if (error && error.name === "ValidationError") {
    res.status(500).json({
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
    const { delivery_fee, delivery_address } = req.body;
    const items = await CartItem.find({ user: req.user._id })
      .populate("product")
      .lean();
    if (!items)
      return res.status().json({
        error: 1,
        message: "You're not create  order because your cart is not items",
      });

    const address = await DeliveryAddress.findById(delivery_address);
    const order = new Order({
      _id: new Types.ObjectId(),
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      status: "delivered",
      user: req.user._id,
    });

    const orderItems = await OrderItems.insertMany(
      items.map((item) => {
        return {
          name: item.product.name,
          price: parseInt(item.product.price),
          qty: parseInt(item.qty),
          product: item.product._id,
          order: order._id,
        };
      })
    );

    orderItems.forEach((item) => order.order_items.push(item));
    await order.save();
    await CartItem.deleteMany({ user: req.user._id });
    res.status(201).json(order);
  } catch (error) {
    errorValidation(error, res, next);
  }
};

const index = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const count = await Order.find({ user: req.user._id }).countDocuments();
    const orders = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("order_items")
      .sort("-createdAt");

    return res.status(200).json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (error) {
    errorValidation(error, res, next);
  }
};

module.exports = { store, index };
