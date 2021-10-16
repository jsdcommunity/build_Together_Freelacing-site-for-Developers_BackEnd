const mongoose = require("mongoose");

function requiredForActiveDeveloper() {
  if(!this.active) return false;
  return this.userType === "developer" || this.userType === "both" ? true : false;
}

function requiredForActiveUser() {
  return this.active;
}

const userSchema = new mongoose.Schema({
  userType: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  password: { type: String, required: true },
  joined: { type: Date, required: true, default: Date.now() },
  active: { type: Boolean, required: true, default: false },
  fullName: { type: String, required: requiredForActiveUser },
  profileImageUrl: { type: String, required: requiredForActiveUser },
  location: { type: String, required: requiredForActiveUser },
  description: { type: String, required: requiredForActiveUser },
  mobileNum: { type: Number, required: false },
  socialMedias: { type: Array, required: false },
  skills: { type: Array, required: requiredForDeveloper },
  projects: { type: Array, required: requiredForDeveloper },
  experience: { type: Array, required: requiredForDeveloper },
  platform: { type: Array, required: requiredForDeveloper },
});

module.exports = mongoose.model("User", userSchema, "users");
