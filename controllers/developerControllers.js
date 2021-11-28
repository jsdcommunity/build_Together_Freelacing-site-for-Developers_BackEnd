const {
   checkUserExist,
   checkJobExist,
   getProposalData,
} = require("../helpers/index");
const { createProposal } = require("../helpers/developerHelpers");
const ErrorResponse = require("../utils/ErrorResponse");
const {
   getProposals: getProposalsForDev,
} = require("../helpers/developerHelpers");

module.exports = {
   saveProposal: async (req, res, next) => {
      const proposalData = req.validData;
      proposalData.createdBy = req.user.userId;
      let proposalId;

      let user;
      let job;

      // Check buyer is exist
      try {
         const { user: userData, isUserExist } = await checkUserExist({
            _id: proposalData.createdBy,
         });
         user = userData;
         if (!isUserExist)
            return next(new ErrorResponse(404, "User not found"));
         if (!userData.active)
            return next(
               new ErrorResponse(
                  403,
                  "You did not have permission to do this because of lack of user information, please update your profile informations."
               )
            );
         if (userData.userType === "buyer")
            return next(
               new ErrorResponse(
                  403,
                  "You did not have permission to do this because of you are buyer. Buyers can't create job proposals."
               )
            );
      } catch (err) {
         return next(err);
      }

      // Check job requirement is exist
      try {
         const { job: jobData, isJobExist } = await checkJobExist({
            _id: proposalData.jobId,
         });
         job = jobData;
         if (!isJobExist) return next(new ErrorResponse(404, "Job not found"));
      } catch (err) {
         return next(err);
      }

      // Check if this developer already sended any proposal on this job
      try {
         const isAlreadyExist = await getProposalData({
            createdBy: user._id,
            jobId: job._id,
         });
         console.log({ isAlreadyExist });
         if (isAlreadyExist)
            return next(
               new ErrorResponse(
                  409,
                  "You already send a proposal to this job requirement!"
               )
            );
      } catch (err) {
         return next(err);
      }

      // Creating job requirement
      try {
         const { _id } = await createProposal(proposalData);
         proposalId = _id;
      } catch (err) {
         return next(err);
      }

      res.status(200).json({
         success: true,
         message: "Proposal created!",
         proposalId,
      });
   },

   getProposals: (req, res, next) =>
      new Promise(async (resolve, reject) => {
         let proposals;
         let { page = 1, count = 12 } = req.query;

         try {
            proposals = await getProposalsForDev(req.user.userId);
            page--;
            let startingIndx = page * count;

            proposals = proposals.splice(startingIndx, count);
         } catch (err) {
            return next(err);
         }

         res.status(200).json({
            success: true,
            proposals,
         });
      }),
};
