const { Schema, model } = require("mongoose");

const deliveryAddressSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama alamat harus di isi"],
    maxlength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
  },
  kelurahan: {
    type: String,
    required: [true, "Kelurahan alamat harus di isi"],
    maxlength: [255, "Panjang maksimal kelurahan alamat adalah 255 karakter"],
  },
  kecamatan: {
    type: String,
    required: [true, "Kecamatan alamat harus di isi"],
    maxlength: [255, "Panjang maksimal kecamatan alamat adalah 255 karakter"],
  },
  kabupaten: {
    type: String,
    required: [true, "Kabupaten alamat harus di isi"],
    maxlength: [255, "Panjang maksimal kabupaten alamat adalah 255 karakter"],
  },
  provinsi: {
    type: String,
    required: [true, "Provinsi alamat harus di isi"],
    maxlength: [255, "Panjang maksimal provinsi  alamat adalah 255 karakter"],
  },
  detail: {
    type: String,
    required: [true, "detail alamat harus di isi"],
    maxlength: [1000, "Panjang maksimal detail alamat adalah 1000 karakter"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("DeliveryAddress", deliveryAddressSchema);
