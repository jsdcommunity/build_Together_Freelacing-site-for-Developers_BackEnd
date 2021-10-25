const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const {
   sendConfirmEmailToken,
   saveUser,
   sendLoginToken,
   sendResetPasswordToken,
   resetPassword,
   updateUserProfile,
} = require("../controllers");
const { getUserAccess } = require("../middlewares");
const {
   validationResults,
   validateToken,
   validateAccess,
} = require("../middlewares/validations");
const {
   validateBasicUser,
   validateEmail,
   validatePassword,
   validateUserType,
   validateUserFields,
} = require("../middlewares/validations/userValidation");

// Sign up user
router.post(
   "/create-user",
   validateBasicUser,
   validateUserType,
   validationResults,
   sendConfirmEmailToken
);
router.post("/confirm-email", validateToken, validationResults, saveUser);

// Login user
router.post(
   "/login-user",
   validateBasicUser,
   validationResults,
   sendLoginToken
);

// Reset password feature in login section of user
router.post(
   "/forgot-password",
   validateEmail,
   validationResults,
   sendResetPasswordToken
);
router.post(
   "/reset-password",
   validatePassword,
   validationResults,
   resetPassword
);

// Update user profile
router.post("/update-user", getUserAccess, validateUserFields, validationResults, updateUserProfile);

module.exports = router;
