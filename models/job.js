const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const jobSchema = mongoose.Schema({
   createdBy: { type: ObjectId, required: true },
   title: { type: String, required: true },
   description: { type: String, required: true },
   createdAt: { type: Date, required: true, default: Date.now() },
   budget: { type: Number, required: true },
   domain: { type: String, required: true },
});

module.exports = mongoose.model("Job", jobSchema, "jobs");
