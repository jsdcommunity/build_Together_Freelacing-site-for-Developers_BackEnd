const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const proposalSchema = mongoose.Schema({
   createdAt: { type: Date, required: true, default: Date.now() },
   createdBy: { type: ObjectId, required: true },
   jobId: { type: ObjectId, required: true },
   amount: { type: Number, required: true },
   description: { type: String, required: true },
   duration: { type: String, required: true },
});

module.exports = mongoose.model("Proposal", proposalSchema, "proposals");
