const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "panjang nama minimal 3 karakter"],
      required: [true, "nama tidak boleh kosong"],
    },
    description: {
      type: String,
      maxlength: [1000, "panjang nama maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    tags:[{
      type: Schema.Types.ObjectId,
      ref: "Tag",
    }],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
