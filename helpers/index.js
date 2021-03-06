const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user");
const JobModel = require("../models/job");
const ProposalModel = require("../models/proposal");
const ErrorResponse = require("../utils/ErrorResponse");

// Creating a instance for nodemailer transporter using official upbit email
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      type: "OAuth2",
      user: process.env.OFFICIAL_EMAIL,
      clientId: process.env.G_CLIENT_ID,
      clientSecret: process.env.G_CLIENT_SECRET,
      refreshToken: process.env.G_REFRESH_TOKEN,
      accessToken: process.env.G_ACCESS_TOKEN,
      expires: 3600000,
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
   checkUserExist: query =>
      new Promise((resolve, reject) => {
         UserModel.findOne(query)
            .then(userExist => {
               if (Boolean(userExist))
                  resolve({
                     user: userExist,
                     isUserExist: Boolean(userExist),
                     message: "This user is already exist",
                  });
               else
                  resolve({
                     isUserExist: Boolean(userExist),
                     message: "This user doesn't exist yet",
                  });
            })
            .catch(err =>
               reject({
                  message: err.message,
               })
            );
      }),

   checkJobExist: query =>
      new Promise((resolve, reject) => {
         JobModel.findOne(query)
            .then(jobExist => {
               if (Boolean(jobExist))
                  resolve({
                     job: jobExist,
                     isJobExist: Boolean(jobExist),
                     message: "This job requirement is already exist",
                  });
               else
                  resolve({
                     isJobExist: Boolean(jobExist),
                     message: "This job requirement doesn't exist yet",
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
            if (!user && !err)
               reject(
                  new ErrorResponse(
                     404,
                     "User not found to update user profile, try login again"
                  )
               );
            err ? reject(err) : resolve(user);
         });
      }),

   getUserData: id =>
      new Promise((resolve, reject) => {
         UserModel.findById(id, "-password")
            .then(user =>
               user
                  ? resolve(user)
                  : reject(new ErrorResponse(404, "User not found"))
            )
            .catch(reject);
      }),

   getJobsData: () =>
      new Promise((resolve, reject) => {
         JobModel.aggregate([
            {
               $lookup: {
                  from: "users",
                  localField: "authorId",
                  foreignField: "_id",
                  as: "userData",
               },
            },
            {
               $unwind: "$userData",
            },
            {
               $project: {
                  authorId: 1,
                  title: 1,
                  shortDescription: 1,
                  description: 1,
                  createdAt: 1,
                  budget: 1,
                  labels: 1,
                  domain: 1,
                  "userData._id": 1,
                  "userData.profileImageUrl": 1,
                  "userData.fullName": 1,
               },
            },
         ])
            .then(jobs => {
               resolve(jobs);
            })
            .catch(reject);
      }),

   getProposalData: query =>
      new Promise((resolve, reject) => {
         ProposalModel.findOne(query)
            .then(proposalData => {
               resolve(proposalData);
            })
            .catch(reject);
      }),
};
