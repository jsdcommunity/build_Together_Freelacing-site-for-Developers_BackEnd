const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BuyerModel = require("../models/buyer");
const DeveloperModel = require("../models/developer");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = {
  checkUserExist: (email, userType) =>
    new Promise((resolve, reject) => {
      switch (userType) {
        case "developer":
          DeveloperModel.findOne({ email: email }).then(developerExist => {
            if (Boolean(developerExist))
            // error messages need to be more user specific
            // return error in reject and catch in "catch"
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
        resolve({ token });
      } catch (err) {
        reject(err);
      }
    }),
  
  verifyToken: (token, secret) => 
    new Promise((resolve, reject) => {
      try {
        const payload = jwt.verify(token, secret);
        resolve(payload);
      } catch (err) {
        reject(err);
      };
    }),

  saveUser: (userData)=> 
    new Promise((resolve, reject)=> {
      const { email, password, userType } = userData;
      bcrypt.hash(password, process.env.HASH_SALT).then(hash => {
        switch (userType) {
          case "buyer":
            const buyer = new BuyerModel({
              email,
              fullName: "",
              profileImageUrl: "",
              password: hash,
              location: "",
              description: "",
              isActive: false,
            });
            buyer.save(function(err) {
              err ? reject(err) : resolve();
            });
            break;
          case "developer":
            const developer = new DeveloperModel({
              email,
              fullName: "",
              profileImageUrl: "",
              password: hash,
              location: "",
              description: "",
              isActive: false,
            });
            developer.save(function(err) {
              err ? reject(err) : resolve();
            });
            break;
          default:
            reject(new ErrorResponse(401, "This user type isn't valid"))
            break;
        }
      }).catch(err => reject(err));
   }),
  
};
