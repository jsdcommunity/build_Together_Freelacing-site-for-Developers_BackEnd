const { check, checkSchema } = require("express-validator");

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
   .isIn(["developer", "buyer", "both"])
   .withMessage("Invalid user type");

const userFields = {
   fullName: {
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isLength: {
         errorMessage: "Full name must be 3 to 20 characters long",
         options: [{ min: 3 }, { max: 20 }],
      },
      errorMessage: "Full name cannot be empty",
   },
   profileImageUrl: {
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isURL: {
         errorMessage: "Invalid profile image url",
         options: {
            protocols: ["https"],
            require_protocol: false,
            require_valid_protocol: true,
         },
      },
      errorMessage: "Please upload profile image",
   },
   location: {
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      errorMessage: "Location can not be empty",
      isLength: {
            errorMessage: "Location must be 2 to 38 characters long",
            options: [{ min: 2 }, { max: 38 }],
      },
   },
   description: {
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isLength: {
         errorMessage: "Description must be 20 to 250 characters long",
         options: [{ min: 20 }, { max: 250 }],
      },
      errorMessage: "Description cannot be empty",
   },
   mobileNum: {
      trim: true,
      isInt: true,
      isMobilePhone: true,
      optional: {
         //Making this field optional
         options: { checkFalsy: true }, //If the input value is null/undifined/false/empty/white space then ignoring the field
      },
      errorMessage: "Enter valid mobile number",
   },
   socialMedias: {
      optional: {
         options: { checkFalsy: true },
      },
      custom: {
         options: value => Array.isArray(value),
      },
      errorMessage: "Please enter valid social media urls",
   },
   "socialMedias.*": {
      //checking for every element in array of input
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isURL: {
         errorMessage: "Invalid social media url",
         options: {
            protocols: ["https"],
            require_protocol: false,
            require_valid_protocol: true,
         },
      },
      errorMessage: "Please provide valid social media urls",
   },
   skills: {
      optional: {
         options: { checkFalsy: true },
      },
      custom: {
         //custom validation
         options: value => Array.isArray(value) && value.length, //checking for input value is array and array contains elements
      },
      errorMessage: "Skills cannot be empty",
   },
   "skills.*": {
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      errorMessage: "Please enter valid skills",
   },
   projects: {
      optional: {
         options: { checkFalsy: true },
      },
      custom: {
         options: value => Array.isArray(value) && value.length,
      },
      errorMessage: "Projects cannot be empty",
   },
   "projects.*": {
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isURL: {
         errorMessage: "Invalid project url",
         options: {
            protocols: ["https"],
            require_protocol: false,
            require_valid_protocol: true,
         },
      },
      errorMessage: "Please enter valid project url",
   },
   experience: {
      optional: {
         options: { checkFalsy: true },
      },
      custom: {
         options: value => Array.isArray(value) && value.length,
      },
      errorMessage: "Experiences cannot be empty",
   },
   "experience.*": {
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      errorMessage: "Please enter valid experience",
   },
   domain: {
      optional: {
         options: { checkFalsy: true },
      },
      custom: {
         options: value => Array.isArray(value) && value.length,
      },
      errorMessage: "Domain cannot be empty",
   },
   "domain.*": {
      trim: true,
      isString: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      errorMessage: "Please enter valid domain",
   },
};

module.exports = {
   validateEmail,
   validatePassword,
   validateUserType,
   validateBasicUser: [validateEmail, validatePassword],
   validateUserFields: checkSchema(userFields),
};
