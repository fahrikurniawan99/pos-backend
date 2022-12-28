const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "nama harus di isi"],
      maxlength: [255, "Panjang nama antara 3 - 255 karakter"],
      minlength: [3, "Panjang nama antara 3 - 255 karakter"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "email harus di isi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "password harus di isi"],
      maxlength: [255, "Panjang password maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  (value) => {
    const email_re =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return email_re.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
