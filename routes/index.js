const express = require("express");
const router = express.Router();

const { sendConfirmEmailToken } = require("../controllers");
const { validateBasicUser } = require("../middlewares/validations/userValidation");

router.post("/create-user", validateBasicUser, sendConfirmEmailToken);

module.exports = router;
