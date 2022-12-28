const { Schema, model } = require("mongoose");

const cartItemsSchema = new Schema({
  name: {
    type: String,
    minlength: [50, "Panjang nama makanan minimal 50 karakter"],
    required: [true, "name must be filled"],
  },
  qty: {
    type: Number,
    required: [true, "qty harus di isi"],
    min: [1, "minimal qty adalah 1"],
  },
  
  price: {
    type: Number,
    default: 0,
  },

  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemsSchema);
