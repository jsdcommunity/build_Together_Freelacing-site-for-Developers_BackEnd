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

const validateShortDescription = check("shortDescription")
   .not()
   .isEmpty()
   .withMessage("Short Description cannot be empty!")
   .isLength({ min: 20 })
   .withMessage("Short Description must be at least 20 characters long!")
   .isLength({ max: 200 })
   .withMessage("Short Description must be a maximum of 200 characters!")
   .isString()
   .withMessage("Short Description must be string!");

const validateDescription = check("description")
   .not()
   .isEmpty()
   .withMessage("Description cannot be empty!")
   .isLength({ min: 50 })
   .withMessage("Description must be at least 50 characters long!")
   .isLength({ max: 750 })
   .withMessage("Description must be a maximum of 750 characters!")
   .isString()
   .withMessage("Description must be string!");

const validateBudget = check("budget")
   .not()
   .isEmpty()
   .withMessage("Budget cannot be empty!")
   .isNumeric()
   .withMessage("Budget isn't a numeric value!")
   .isLength({ min: 2 })
   .withMessage("Budget must be at least 2 digit long!")
   .isLength({ max: 10 })
   .withMessage("Budget must be a maximum of 10 digits!");

const validateDomain = check("domain")
   .not()
   .isEmpty()
   .withMessage("Domain cannot be empty!")
   .isLength({ min: 1 })
   .withMessage("Domain must be at least 1 characters long!")
   .isLength({ max: 32 })
   .withMessage("Domain must be a maximum of 32 characters!")
   .isString()
   .withMessage("Domain must be string!");

const validateLabels = check("labels")
   .not()
   .isEmpty()
   .withMessage("Labels cannot be empty!")
   .isArray()
   .withMessage("Labels must be array!")
   .isLength({ min: 1 })
   .withMessage("Add atleast one label.")
   .isLength({ max: 8 })
   .withMessage("Maximum 8 labels allowed!");

const validateJobFields = [
   validateTitle,
   validateDescription,
   validateBudget,
   validateDomain,
   validateLabels,
   validateShortDescription,
];

module.exports = validateJobFields;

module.exports.validateTitle = validateTitle;
module.exports.validateDescription = validateDescription;
module.exports.validateBudget = validateBudget;
module.exports.validateDomain = validateDomain;
