const { checkSchema } = require("express-validator");

const validateProposal = checkSchema({
   jobId: {
      trim: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isMongoId: {
         errorMessage: "Job id must be a valid id.",
         bail: true,
      },
      errorMessage: "Job id cannot be empty",
   },
   amount: {
      trim: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isNumeric: {
         errorMessage: "Amount must be a numric value.",
      },
      isLength: {
         options: {
            max: 10,
            min: 2,
         },
         errorMessage: "Amount must be a 2-10 digit number.",
      },
      errorMessage: "Amount cannot be empty",
   },
   duration: {
      trim: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isString: {
         errorMessage: "Duration must be a string.",
      },
      isLength: {
         options: {
            min: 2,
            max: 8,
         },
         errorMessage: "Duration must be 2-8 characters long.",
      },
      errorMessage: "Duration cannot be empty",
   },
   description: {
      trim: true,
      notEmpty: {
         options: { ignore_whitespace: true },
      },
      isString: {
         errorMessage: "Description must be a string.",
      },
      isLength: {
         options: {
            min: 20,
            max: 350,
         },
         errorMessage: "Description must be 20-350 characters long.",
      },
      errorMessage: "Description cannot be empty",
   },
});

module.exports = validateProposal;
