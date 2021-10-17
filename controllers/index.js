const ErrorResponse = require("../utils/ErrorResponse");
const path = require("path");
const bcrypt = require("bcrypt")
const {
  checkUserExist,
  createToken,
  sendOfficialEmail,
  compileHTMLEmailTemplate,
  verifyToken,
  saveUser,
} = require("../helpers");

module.exports = {
  sendConfirmEmailToken: async (req, res, next) => {
    const userData = req.body;
    const { email } = userData;

    let token;
    let confirmUrl;
    let htmlContent;
    const confirmEmailTemplatePath = path.resolve("utils/email-templates/confirm-email.html");

    // Checking if user exist
    try {
      let { userExist, message } = await checkUserExist(email);
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

    // Sending status response to front end
    res.status(250).json({
      success: true,
      message: "Verify email successfully send to " + email,
    });
  },

  createUser: (req, res, next)=> {
    const { token } = req.body;
    let tokenData;
    // verifying token
    verifyToken(token, process.env.JWT_SECRET_KEY)
      .then(response => {
        tokenData = response;
        // check for duplicate confirmation link
        return checkUserExist(response.email);
      })
      .then(({userExist}) => {
        if (userExist) throw new ErrorResponse(409, "Email already confirmed! try login");
        // creating new user
        return saveUser(tokenData);
      })
      .then(user => {
        const { _id, userType, active } = user;
        // creating new login token
        return createToken({_id, userType, active}, "18d");
      })
      .then(token => {
        res.status(201).json({
          success: true,
          token,
          message: "Email confirmed successfully",
        });
      })
      .catch(err => {
        err.name == "TokenExpiredError" && next(new ErrorResponse(408, "Link expaired! Please signup again"));
        err.name == "JsonWebTokenError" && next(new ErrorResponse(401, "Invalid token! Please try again"));
        next(err);
      });
  },

  sendLoginToken: (req,  res, next) => {
    const { email, password } = req.body;
    let userData;
    checkUserExist(email) //finding user in db
      .then(({user, userExist}) => {
        if(!userExist) throw new ErrorResponse(401, "There is no account associated with this email, Signup now");
        userData = user;
        return bcrypt.compare(password, user.password); //if user exist comparing passwords
      })
      .then(result => {
        if(!result) throw new ErrorResponse(401, "Invalid password!");
        const { _id, userType, active } = userData;
        return createToken({ _id, userType, active }, "18d"); // if passwords are same creating token
      })
      .then(token => {
        res.status(200).json({
          success: true,
          token,
          message: "Logined Successfully"
        });
      })
      .catch(err => {
        next(err);
      });
  },
};
