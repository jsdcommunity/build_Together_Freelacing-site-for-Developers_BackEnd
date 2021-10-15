const ErrorResponse = require("../utils/ErrorResponse");
const path = require("path");
const BuyerModel = require("../models/buyer");
const DeveloperModel = require("../models/developer");
const {
  checkUserExist,
  createToken,
  sendOfficialEmail,
  compileHTMLEmailTemplate,
} = require("../helpers");

module.exports = {
  sendConfirmEmailToken: async (req, res, next) => {
    const userData = req.body;
    const { email, userType } = userData;

    let token;
    let confirmUrl;
    let htmlContent;
    const confirmEmailTemplatePath = path.resolve("config/email-templates/confirm-email.html");

    // Checking if user exist
    try {
      let { userExist, message } = await checkUserExist(email, userType);
      if (userExist) return next(new ErrorResponse(409, message));
    } catch (err) {
      next(new ErrorResponse(401, err.message));
    }

    // Generating new token for sending with confirm url
    try {
      token = await createToken(userData);
      confirmUrl = "https://but-jsd-3.herokuapp.com/confirm-account?token=" + token;
    } catch (err) {
      return next(new ErrorResponse(500, err.message));
    }

    // Generating html content for sending in email
    try {
      htmlContent = await compileHTMLEmailTemplate(confirmEmailTemplatePath, {
        confirmUrl,
      });
    } catch (err) {
      return next(new ErrorResponse(500, err.message));
    }

    // Sending confirm email
    try {
      const response = await sendOfficialEmail({
        toEmail: email,
        subject: "Activate Your UpBit Account Now",
        htmlContent,
      });
      console.log({ response });
    } catch (err) {
      next(new ErrorResponse(500, err.message));
    }

    // Sending response status response to front end
    res.status(250).json({
      success: true,
      message: "Verify email successfully send to " + email,
    });
  },
};
