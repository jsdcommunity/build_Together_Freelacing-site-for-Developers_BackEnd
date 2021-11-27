const express = require("express");
const router = express.Router();

const {
   saveProposal,
   getProposals,
} = require("../controllers/developerControllers");
const validateProposal = require("../middlewares/validations/proposalValidation");
const { validationResults } = require("../middlewares/validations");

// Create proposal
router.post(
   "/create-proposal",
   validateProposal,
   validationResults,
   saveProposal
);

// Get created proposals
router.get("/get-proposals", getProposals);

module.exports = router;
