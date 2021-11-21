const express = require("express");
const router = express.Router();

const { createProposal } = require("../controllers/developerControllers");
const validateProposal = require("../middlewares/validations/proposalValidation");
const { validationResults } = require("../middlewares/validations");

router.post(
   "/create-proposal",
   validateProposal,
   validationResults,
   createProposal
);

module.exports = router;
