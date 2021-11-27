const express = require("express");
const router = express.Router();

const { saveJob, getJobs } = require("../controllers/buyerControllers");
const validateJobFields = require("../middlewares/validations/jobValidation");
const { validationResults } = require("../middlewares/validations");

// Create a job requirement
router.post("/create-job", validateJobFields, validationResults, saveJob);

// Get created jobs
router.get("/get-jobs", getJobs);

module.exports = router;
