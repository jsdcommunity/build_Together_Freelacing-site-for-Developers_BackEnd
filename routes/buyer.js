const express = require("express");
const router = express.Router();

const {} = require("../controllers/buyerControllers");
const validateJobFields = require("../middlewares/validations/jobValidation");
const { validationResults } = require("../middlewares/validations");

// Create a job requirement
router.post("/create-job", validateJobFields, validationResults, (req, res) => {
   res.send("validation success");
});

module.exports = router;
