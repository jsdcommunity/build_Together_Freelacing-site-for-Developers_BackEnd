const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const jobSchema = mongoose.Schema({
   authorId: { type: ObjectId, required: true },
   title: { type: String, required: true },
   shortDescription: { type: String, required: true },
   description: { type: String, required: true },
   createdAt: { type: Date, required: true, default: Date.now() },
   budget: { type: Number, required: true },
   domain: { type: String, required: true },
   labels: { type: Array, required: true, default: [] },
});

module.exports = mongoose.model("Job", jobSchema, "jobs");
