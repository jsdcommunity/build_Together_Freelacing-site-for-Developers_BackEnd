const { checkUserExist } = require("../helpers");
const { createJob } = require("../helpers/buyerHelpers");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = {
   saveJob: async (req, res, next) => {
      const jobData = req.validData;
      let jobId;

      try {
         // check author is exist
         const { userExist } = await checkUserExist({ _id: jobData.authorId });
         if (!userExist) return next(new ErrorResponse(404, "User not found"));
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
