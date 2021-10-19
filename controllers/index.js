const ErrorResponse = require("../utils/ErrorResponse");
const path = require("path");
const bcrypt = require("bcrypt")
const {
  checkUserExist,
  createToken,
  sendOfficialEmail,
  compileHTMLEmailTemplate,
  verifyToken,
  createUser,
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

  saveUser: async (req, res, next)=> {
    const { token } = req.body;
    let loginToken;

    try {
      // verifying token
      const tokenData = await verifyToken(token, process.env.JWT_SECRET_KEY);

      // check for duplicate confirmation link
      const { userExist } = await checkUserExist(tokenData.email);
      if(userExist) throw new ErrorResponse(409, "Email already confirmed! try login");

      // creating new user
      const newUser = await createUser(tokenData);

      // creating new login token
      const { _id, userType, active } = newUser;
      loginToken = await createToken({_id, userType, active}, "18d");

    } catch (err) {
      if(err.name == "TokenExpiredError") return next(new ErrorResponse(408, "Link expaired! Please signup again"));//error from token verification
      if(err.name == "JsonWebTokenError") return next(new ErrorResponse(401, "Invalid token! Please try again"));//error from token verification
      return next(err);
    }

    //sending response with login token
    res.status(201).json({
      success: true,
      token: loginToken,
      message: "Email confirmed successfully",
    });
  },

  sendLoginToken: async (req,  res, next) => {
    const { email, password } = req.body;
    let userData;
    let loginToken;

    try {
      // finding user in db
      const { user, userExist } = await checkUserExist(email);
      if(!userExist) throw new ErrorResponse(404, "There is no account associated with this email, Signup now");
      userData = user;
    } catch (err) {
      return next(err);
    }

    try {
      //if user exist comparing passwords
      const result = await bcrypt.compare(password, userData.password);
      if(!result) throw new ErrorResponse(401, "Invalid password!");
    } catch (err) {
      return next(err);
    }

    try {
      // if passwords are same creating token
      const { _id, userType, active } = userData;
      loginToken = await createToken({_id, userType, active}, "18d");
    } catch (err) {
      return next(err);
    }

    res.status(200).json({
      success: true,
      token: loginToken,
      message: "Logged in Successfully"
    });
  },
};
