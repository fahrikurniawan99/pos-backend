const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "panjang nama minimal 3 karakter"],
      maxlength: [20, "panjang nama maksimal 20 karakter"],
      required: [true, "kategori tidak boleh kosong"],
    },
  }
);

module.exports = model("Category", categorySchema);
