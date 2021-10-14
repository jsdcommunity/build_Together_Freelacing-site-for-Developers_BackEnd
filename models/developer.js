const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  fullName: { type: String, required: true },
  profileImageUrl: { type: String, required: true },
  joined: { type: Date, required: true, default: Date.now() },
  password: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  mobile: { type: Number, required: false },
  skills: { type: Array, required: false },
  experience: { type: Array, required: false },
  socialMedias: { type: Array, required: false },
  projects: { type: Array, required: false },
  platform: { type: Array, required: false },
});

module.exports = mongoose.model("Developer", developerSchema, "developers");
