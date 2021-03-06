const ErrorResponse = require("../utils/ErrorResponse");
const path = require("path");
const bcrypt = require("bcrypt");
const {
   checkUserExist,
   createToken,
   sendOfficialEmail,
   compileHTMLEmailTemplate,
   verifyToken,
   createUser,
   updateUser,
   getUserData,
   getJobsData,
} = require("../helpers");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
   sendConfirmEmailToken: async (req, res, next) => {
      const userData = req.body;
      const { email } = userData;

      let token;
      let confirmUrl;
      let htmlContent;
      const confirmEmailTemplatePath = path.resolve(
         "utils/email-templates/confirm-email.html"
      );

      // Checking if user exist
      try {
         let { isUserExist, message } = await checkUserExist({ email });
         if (isUserExist) return next(new ErrorResponse(409, message));
      } catch (err) {
         return next(new ErrorResponse(401, err.message));
      }

      // Generating new token for sending with confirm url
      try {
         token = await createToken(userData);
         confirmUrl =
            "https://but-jsd-3.herokuapp.com/confirm-account?token=" + token;
      } catch (err) {
         return next(new ErrorResponse(500, err.message));
      }
      // Generating html content for sending in email
      try {
         htmlContent = await compileHTMLEmailTemplate(
            confirmEmailTemplatePath,
            {
               confirmUrl,
            }
         );
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
         return next(new ErrorResponse(500, err.message));
      }

      // Sending status response to front end
      res.status(250).json({
         success: true,
         message: "Verify email successfully send to " + email,
      });
   },

   saveUser: async (req, res, next) => {
      const { token } = req.body;
      let loginToken;

      try {
         // verifying token
         const tokenData = await verifyToken(token);

         // check for duplicate confirmation link
         const { isUserExist } = await checkUserExist({
            email: tokenData.email,
         });
         if (isUserExist)
            throw new ErrorResponse(409, "Email already confirmed!");

         // creating new user
         const newUser = await createUser(tokenData);

         // creating new login token
         const { _id, userType, active } = newUser;
         loginToken = await createToken(
            { userId: _id, userType, active },
            "18d"
         );
      } catch (err) {
         if (err.name == "TokenExpiredError")
            return next(new ErrorResponse(410, "Link expired!")); //error from token verification
         if (err.name == "JsonWebTokenError")
            return next(new ErrorResponse(401, "Invalid token!")); //error from token verification
         return next(err);
      }

      //sending response with login token
      res.status(201).json({
         success: true,
         token: loginToken,
         message: "Email confirmed successfully!",
      });
   },

   sendLoginToken: async (req, res, next) => {
      const { email, password } = req.body;
      let userData;
      let loginToken;

      try {
         // finding user in db
         const { user, isUserExist } = await checkUserExist({ email });
         if (!isUserExist)
            throw new ErrorResponse(
               404,
               "There is no account associated with this email, Sign up now"
            );
         userData = user;
      } catch (err) {
         return next(err);
      }

      try {
         //if user exist, comparing passwords
         const result = await bcrypt.compare(password, userData.password);
         if (!result) throw new ErrorResponse(401, "Invalid password!");
      } catch (err) {
         return next(err);
      }

      try {
         // if passwords are same creating token
         const { _id, userType, active } = userData;
         loginToken = await createToken(
            { userId: _id, userType, active },
            "18d"
         );
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         token: loginToken,
         message: "Logged in Successfully",
      });
   },

   sendResetPasswordToken: async (req, res, next) => {
      const { email } = req.body;
      let resetToken;
      let htmlContent;
      const resetPasswordEmailTemplatePath = path.resolve(
         "utils/email-templates/reset-password-email.html"
      );

      try {
         // check if user exists with giver email
         const { isUserExist } = await checkUserExist({ email });
         if (!isUserExist)
            throw new ErrorResponse(
               404,
               "There is no account associated with this email, Sign up now"
            );
      } catch (err) {
         return next(err);
      }

      try {
         // creating jwt token for reset password link
         resetToken = await createToken({ email }, "10m");
      } catch (err) {
         return next(err);
      }

      try {
         // creating email with reset password link
         const resetUrl = `https://but-jsd-3.herokuapp.com/reset-password/${resetToken}`;
         htmlContent = await compileHTMLEmailTemplate(
            resetPasswordEmailTemplatePath,
            { resetUrl }
         );
      } catch (err) {
         return next(new ErrorResponse(500));
      }

      try {
         // sending email
         const response = await sendOfficialEmail({
            toEmail: email,
            subject: "Reset your password now",
            htmlContent,
         });
      } catch (err) {
         return next(new ErrorResponse(500));
      }

      // sending response to front
      res.status(250).json({
         success: true,
         message: "Reset password link successfully send to " + email,
      });
   },

   resetPassword: async (req, res, next) => {
      const { token, password } = req.body;
      let tokenData;
      let hashPassword;

      try {
         // verifying jwt
         tokenData = await verifyToken(token);
      } catch (err) {
         if (err.name == "TokenExpiredError")
            return next(
               new ErrorResponse(410, "Link expired! Please try again")
            ); //error from token verification
         if (err.name == "JsonWebTokenError")
            return next(
               new ErrorResponse(401, "Invalid token! Please try again")
            ); //error from token verification
         return next(err);
      }

      try {
         // hashing password
         hashPassword = await bcrypt.hash(
            password,
            parseInt(process.env.HASH_SALT)
         );
      } catch (err) {
         return next(err);
      }

      try {
         // updating password
         const { email } = tokenData;
         const user = await updateUser({ email }, { password: hashPassword });
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         message: "Password changed successfully",
      });
   },

   updateUserProfile: async (req, res, next) => {
      const id = req.user.userId;
      const data = req.validData;
      data.active = true;
      let newUser, token;

      try {
         // updating user profile data
         newUser = await updateUser({ _id: id }, data);
      } catch (err) {
         return next(err);
      }

      try {
         // creating new updated login token
         const { _id, userType, active } = newUser;
         token = await createToken({ userId: _id, userType, active }, "18d");
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         token,
         message: "User profile updated",
      });
   },

   getUser: async (req, res, next) => {
      const id = req.params.id;
      let user;

      if (!ObjectId.isValid(id))
         return next(new ErrorResponse(400, "User id is not valid!"));

      try {
         user = await getUserData(id);
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         user,
      });
   },

   getJobs: async (req, res, next) => {
      let jobs;
      let { page = 1, count = 12 } = req.query;

      try {
         jobs = await getJobsData();
         page--;
         let startingIndx = page * count;

         jobs = jobs.splice(startingIndx, count);
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         jobs,
      });
   },
};
