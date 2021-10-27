const { verifyToken } = require("../helpers");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = {
   getUserAccess: async (req, res, next) => {
      const token = req.headers.authorization;
      let userData;

      // verifying token
      try {
         userData = await verifyToken(token);
      } catch (err) {
         if (err.name == "TokenExpiredError")
            return next(
               new ErrorResponse(401, "Unauthorized Please login again")
            ); //error from token verification
         if (err.name == "JsonWebTokenError")
            return next(new ErrorResponse(401, "Invalid login credentils")); //error from token verification
         return next(err);
      }
      req.user = userData;
      return next();
   },

   getAdminAccess: (req, res, next) => next(),
};
