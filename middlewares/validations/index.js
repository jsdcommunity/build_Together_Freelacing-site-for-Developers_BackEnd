const { check, validationResult } = require("express-validator");
const ErrorResponse = require("../../utils/ErrorResponse");

module.exports = {
    validationResults: (req, res, next) =>{
        const error = validationResult(req);
        console.log(error);
        if(!error.isEmpty()) next(new ErrorResponse(401, error));
        next()
    },

    validateToken: [
        check("token").isJWT("Invalid token! try again")
    ],
}