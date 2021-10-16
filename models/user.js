const mongoose = require("mongoose");

function requiredForDeveloper() {
  return this.userType === "developer" || this.userType === "both" ? true : false;
}

const userSchema = new mongoose.Schema({
  userType: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  fullName: { type: String, required: true },
  profileImageUrl: { type: String, required: true },
  joined: { type: Date, required: true, default: Date.now() },
  password: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  mobileNum: { type: Number, required: false },
  socialMedias: { type: Array, required: false },
  skills: { type: Array, required: requiredForDeveloper },
  projects: { type: Array, required: requiredForDeveloper },
  experience: { type: Array, required: requiredForDeveloper },
  platform: { type: Array, required: requiredForDeveloper },
});

module.exports = mongoose.model("User", userSchema, "users");
