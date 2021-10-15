const fs = require("fs");
const jwt = require("jsonwebtoken");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");
const BuyerModel = require("../models/buyer");
const DeveloperModel = require("../models/developer");

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
  checkUserExist: (email, userType) =>
    new Promise((resolve, reject) => {
      switch (userType) {
        case "developer":
          DeveloperModel.findOne({ email: email }).then(developerExist => {
            if (Boolean(developerExist))
              resolve({
                userExist: true,
                message: "This developer email is already exist in developers",
              });
            else
              resolve({
                userExist: false,
                message: "This developer doesn't exist yet",
              });
          });
          break;
        case "buyer":
          BuyerModel.findOne({ email: email }).then(buyerExist => {
            if (Boolean(buyerExist))
              resolve({
                userExist: true,
                message: "This buyer email is already exist in buyers",
              });
            else
              resolve({
                userExist: false,
                message: "This buyer doesn't exist yet",
              });
          });
          break;
        default:
          reject({
            message: "This user type isn't valid",
          });
      }
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
};
