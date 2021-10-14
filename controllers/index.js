const ErrorResponse = require("../utils/ErrorResponse");
const BuyerModel = require("../models/buyer");
const DeveloperModel = require("../models/developer");
const { checkUserExist } = require("../helpers");

module.exports = {
  sendConfirmEmailToken: (req, res, next) => {
    let { email, password, userType } = req.body;

    checkUserExist(email, userType)
      .then(response => {
        let { userExist, message } = response;
        if (userExist) next(new ErrorResponse(409, message));
        // Need to add verification email sending with "nodemailer"
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
