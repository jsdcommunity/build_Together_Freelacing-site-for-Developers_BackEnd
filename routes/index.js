const express = require("express");
const router = express.Router();

const {
   sendConfirmEmailToken,
   saveUser,
   sendLoginToken,
   sendResetPasswordToken,
   resetPassword,
   updateUserProfile,
   getUser,
} = require("../controllers");
const { getUserAccess } = require("../middlewares");
const {
   validationResults,
   validateToken,
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
router.put(
   "/update-user",
   getUserAccess,
   validateUserFields,
   validationResults,
   updateUserProfile
);

// Get user data
router.get("/get-user/:id", getUser);

module.exports = router;
