const { check, validationResult } = require("express-validator");

const validateEmail = check("email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("Email must be valid!")
  .not()
  .isEmpty()
  .withMessage("Email cannot be empty!")
  .bail()
  .isLength({ min: 3 })
  .withMessage("Minimum 3 characters required!")
  .isLength({ max: 30 })
  .withMessage("Maximum 30 characters only!");

const validatePassword = check("password")
  .not()
  .isEmpty()
  .withMessage("Password cannot be empty!")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long!")
  .isLength({ max: 24 })
  .withMessage("Password must be a maximum of 24 characters!")
  .matches(/\d\w/gi)
  .withMessage("Password must contain numeric and alphabetic characters");

const validateUserType = check("userType")
  .trim()
  .not()
  .isEmpty()
  .withMessage("User type cannot be empty!")
  .isIn(["developer", "buyer"])
  .withMessage("Invalid user type")

module.exports = {
  validateEmail,
  validatePassword,
  validateUserType,
  validateBasicUser: [validateEmail, validatePassword],
};
