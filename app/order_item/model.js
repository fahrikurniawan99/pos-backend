const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "nama must be filled"],
  },
  price: {
    type: Number,
    required: [true, "Harga item harus di isi"],
  },
  qty: {
    type: Number,
    required: [true, "Kuantitas harus di isi"],
    min: [1, "Kuantitas minimal 1"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);
