const express = require("express");
const router = express.Router();

const {
    sendConfirmEmailToken,
    saveUser,
    sendLoginToken,
    sendResetPasswordToken,
    resetPassword
} = require("../controllers");
const { validationResults, validateToken } = require("../middlewares/validations");
const { validateBasicUser, validateEmail, validatePassword } = require("../middlewares/validations/userValidation");

router.post("/create-user", validateBasicUser, validationResults, sendConfirmEmailToken);
router.post("/confirm-email", validateToken, validationResults, saveUser);

router.post("/login-user", validateBasicUser, validationResults, sendLoginToken);

router.post("/forgot-password", validateEmail, validationResults, sendResetPasswordToken);
router.post("/reset-password", validatePassword, validationResults, resetPassword);

module.exports = router;
