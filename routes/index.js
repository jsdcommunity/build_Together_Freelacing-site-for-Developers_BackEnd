const express = require("express");
const router = express.Router();

const { sendConfirmEmailToken, saveUser, sendLoginToken } = require("../controllers");
const { validationResults, validateToken } = require("../middlewares/validations");
const { validateBasicUser } = require("../middlewares/validations/userValidation");

router.post("/create-user", validateBasicUser, validationResults, sendConfirmEmailToken);
router.post("/confirm-email", validateToken, validationResults, saveUser);
router.post("/login", validateBasicUser, validationResults, sendLoginToken);

module.exports = router;
