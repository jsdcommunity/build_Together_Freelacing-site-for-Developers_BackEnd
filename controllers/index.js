const ErrorResponse = require("../utils/ErrorResponse");
const BuyerModel = require("../models/buyer");
const DeveloperModel = require("../models/developer");
const { checkUserExist, createToken } = require("../helpers");

module.exports = {
  sendConfirmEmailToken: (req, res, next) => {
    const userData = req.body;
    const { email, password, userType } = userData;
    let token;

    checkUserExist(email, userType)
      .then(response => {
        let { userExist, message } = response;
        if (userExist) return next(new ErrorResponse(409, message));

        // Need to add verification email sending with "nodemailer"
        createToken(userData)
          .then(response => {
            token = response.token;
          })
          .catch(err => {
            return next(new ErrorResponse(500, err.message));
          });

        res.status(200).json({
          success: true,
          message: "Verify email successfully send to " + email,
        });
      })
      .catch(err => {
        next(new ErrorResponse(401, err.message));
      });
  },
};
