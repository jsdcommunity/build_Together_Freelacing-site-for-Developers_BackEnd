const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  fullName: { type: String, required: true },
  profileImageUrl: { type: String, required: true },
  joined: { type: Date, required: true, default: Date.now() },
  password: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  mobile: { type: Number, required: false },
});

module.exports = mongoose.model("Buyer", buyerSchema, "buyers");
