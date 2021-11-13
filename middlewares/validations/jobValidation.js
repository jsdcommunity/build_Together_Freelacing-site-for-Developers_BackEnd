const { check } = require("express-validator");

const validateTitle = check("title")
   .not()
   .isEmpty()
   .withMessage("Title cannot be empty!")
   .isLength({ min: 8 })
   .withMessage("Title must be at least 8 characters long!")
   .isLength({ max: 38 })
   .withMessage("Title must be a maximum of 24 characters!")
   .isString()
   .withMessage("Title must be string!");

const validateDescription = check("description")
   .not()
   .isEmpty()
   .withMessage("Description cannot be empty!")
   .isLength({ min: 20 })
   .withMessage("Description must be at least 20 characters long!")
   .isLength({ max: 250 })
   .withMessage("Description must be a maximum of 250 characters!")
   .isString()
   .withMessage("Description must be string!");

const validateBudget = check("budget")
   .not()
   .isEmpty()
   .withMessage("Budget id cannot be empty!")
   .isNumeric()
   .withMessage("Budget isn't a numeric value!")
   .isLength({ min: 1 })
   .withMessage("Budget must be at least 1 characters long!")
   .isLength({ max: 10 })
   .withMessage("Budget must be a maximum of 10 characters!");

const validateDomain = check("domain")
   .not()
   .isEmpty()
   .withMessage("Domain id cannot be empty!")
   .isLength({ min: 1 })
   .withMessage("Domain must be at least 1 characters long!")
   .isLength({ max: 32 })
   .withMessage("Domain must be a maximum of 32 characters!")
   .isString()
   .withMessage("Domain must be string!");

const validateJobFields = [
   validateTitle,
   validateDescription,
   validateBudget,
   validateDomain,
];

module.exports = validateJobFields;

module.exports.validateTitle = validateTitle;
module.exports.validateDescription = validateDescription;
module.exports.validateBudget = validateBudget;
module.exports.validateDomain = validateDomain;
