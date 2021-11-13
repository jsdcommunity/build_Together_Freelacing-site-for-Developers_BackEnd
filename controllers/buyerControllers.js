const { checkUserExist } = require("../helpers");
const { createJob } = require("../helpers/buyerHelpers");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = {
   saveJob: async (req, res, next) => {
      const jobData = req.validData;
      jobData.authorId = req.user.userId;
      let jobId;

      try {
         // check author is exist
         const { userExist, user } = await checkUserExist({
            _id: jobData.authorId,
         });
         if (!userExist) return next(new ErrorResponse(404, "User not found"));
         if (!user.active)
            return next(
               new ErrorResponse(
                  403,
                  "You did not have permission to do this because of lack of user information, please update your profile informations."
               )
            );
      } catch (err) {
         return next(err);
      }

      try {
         // Creating job requirement
         const { _id } = await createJob(jobData);
         jobId = _id;
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         message: "Job requirement created!",
         jobId,
      });
   },
};
