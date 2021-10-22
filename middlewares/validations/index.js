const { check, validationResult } = require("express-validator");
const ErrorResponse = require("../../utils/ErrorResponse");

module.exports = {
   validationResults: (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) next(new ErrorResponse(401, error.array()[0].msg));
      next();
   },

   validateToken: [
      check("token").isJWT().withMessage("Invalid token! please try again"),
   ],
};
