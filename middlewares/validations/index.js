const { check, validationResult, matchedData } = require("express-validator");
const ErrorResponse = require("../../utils/ErrorResponse");

module.exports = {
   validationResults: (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) next(new ErrorResponse(400, error.array()[0].msg));
      data = matchedData(req, { onlyValidData: true, includeOptionals: false });
      req.validData = data;
      next();
   },

   validateToken: [
      check("token").isJWT().withMessage("Invalid token! please try again"),
   ],
};
