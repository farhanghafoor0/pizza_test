const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      default: "customer",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
