const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user");

// Creating a instance for nodemailer transporter using official upbit email
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.OFFICIAL_EMAIL,
      pass: process.env.EMAIL_PASS,
   },
});

// Read HTML file
const readHTMLFile = function (path, callback) {
   fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
         callback(err);
         throw err;
      } else {
         callback(null, html);
      }
   });
};

module.exports = {
   checkUserExist: email =>
      new Promise((resolve, reject) => {
         UserModel.findOne({ email: email })
            .then(userExist => {
               if (Boolean(userExist))
                  resolve({
                     user: userExist,
                     userExist: true,
                     message: "This user email is already exist",
                  });
               else
                  resolve({
                     userExist: false,
                     message: "This user doesn't exist yet",
                  });
            })
            .catch(err =>
               reject({
                  message: err.message,
               })
            );
      }),

   createToken: (data, expiresIn = "15m") =>
      new Promise((resolve, reject) => {
         try {
            const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
               expiresIn,
            });
            resolve(token);
         } catch (err) {
            reject(err);
         }
      }),

   verifyToken: (token, secret = process.env.JWT_SECRET_KEY) =>
      new Promise(async (resolve, reject) => {
         try {
            const payload = await jwt.verify(token, secret);
            resolve(payload);
         } catch (err) {
            reject(err);
         }
      }),

   compileHTMLEmailTemplate: (HTMLTemplatePath, replacements = {}) =>
      new Promise((resolve, reject) => {
         readHTMLFile(HTMLTemplatePath, function (err, html) {
            if (err) reject(err);
            else {
               const template = handlebars.compile(html);
               const compiledHTML = template(replacements);
               resolve(compiledHTML);
            }
         });
      }),

   sendOfficialEmail: ({ toEmail, subject, htmlContent }) =>
      new Promise((resolve, reject) => {
         // Mail options
         let mailOptions = {
            from: process.env.OFFICIAL_EMAIL,
            to: toEmail,
            subject,
            html: htmlContent,
         };

         // Sending email
         transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
               console.error(err);
               reject(err);
            } else {
               resolve({ msg: "Verify email successfully send to " + toEmail });
            }
         });
      }),

   createUser: userData =>
      new Promise((resolve, reject) => {
         const { email, password, userType } = userData;
         // creatig hash password
         bcrypt
            .hash(password, parseInt(process.env.HASH_SALT))
            // creating new user
            .then(hash => {
               const user = new UserModel({
                  active: false,
                  userType,
                  email,
                  password: hash,
               });
               user.save((err, user) => {
                  err ? reject(err) : resolve(user);
               });
            })
            .catch(err => reject(new ErrorResponse(500)));
      }),

   updateUser: (match, data) =>
      new Promise((resolve, reject) => {
         UserModel.findOneAndUpdate(match, data, { new: true }, (err, user) => {
            err ? reject(err) : resolve(user);
         });
      }),
};
