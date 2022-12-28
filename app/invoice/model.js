const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema({
  sub_total: {
    type: Number,
    required: [true, "sub_total harus di isi"],
  },
  delivery_fee: {
    type: Number,
    required: [true, "delivery_fee harus di isi"],
  },
  delivery_address: {
    provinsi: { type: String, required: [true, "provinsi harus di isi"] },
    kabupaten: { type: String, required: [true, "kabupaten harus di isi"] },
    kecamatan: { type: String, required: [true, "kecamatan harus di isi"] },
    kelurahan: { type: String, required: [true, "kelurahan harus di isi"] },
    detail: { type: String },
  },
  total: {
    type: Number,
    required: [true, "total harus di isi"],
  },
  payment_status: {
    type: String,
    enum: ["waiting_payment", "paid"],
    default: "waiting_payment",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("Invoice", invoiceSchema);
