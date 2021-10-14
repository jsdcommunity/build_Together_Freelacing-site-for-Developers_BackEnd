const BuyerModel = require("../models/buyer");
const DeveloperModel = require("../models/developer");

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
  createToken: userData =>
    new Promise((resolve, reject) => {
      // This isn't finished yet
      let { email, password } = userData;
    }),
};
