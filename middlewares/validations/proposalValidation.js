const { checkSchema } = require("express-validator");

const validateProposal = checkSchema({
   jobId: {
      isMongoId: {
         errorMessage: "Job id must be a valid id.",
         bail: true,
      },
   },
   amount: {
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
   },
   duration: {
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
   },
   description: {
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
   },
});

module.exports = validateProposal;
