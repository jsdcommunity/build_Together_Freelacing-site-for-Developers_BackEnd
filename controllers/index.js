const ErrorResponse = require("../utils/ErrorResponse");
const { checkUserExist, createToken, verifyToken, saveUser } = require("../helpers");
const { response } = require("express");

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
        createToken(userData) // chances of contamination of other values
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

  createUser: (req, res, next)=> {
    const { token } = req.body;
    verifyToken(token, process.env.JWT_SECRET_KEY)
      .then(response => {
        saveUser(response)
          .then(response => {
            res.status(201).json({
              success: true,
              message: "Email confirmed successfully",
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
};
