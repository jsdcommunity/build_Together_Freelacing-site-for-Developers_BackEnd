const { check, validationResult } = require("express-validator");

module.exports = {
  validateBasicUser: [
    check("email")
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
      .withMessage("Maximum 30 characters only!"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty!")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long!")
      .isLength({ max: 24 })
      .withMessage("Password must be a maximum of 24 characters!")
      .matches(/\d\w/gi)
      .withMessage("Password must contain numeric and alphabetic characters"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      next();
    },
  ],
};
