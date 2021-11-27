const { checkUserExist, checkJobExist } = require("../helpers/index");
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

      // Check buyer is exist
      try {
         const { user, isUserExist } = await checkUserExist({
            _id: proposalData.createdBy,
         });
         if (!isUserExist)
            return next(new ErrorResponse(404, "User not found"));
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

      // Check job requirement is exist
      try {
         const { job, isJobExist } = await checkJobExist({
            _id: proposalData.jobId,
         });
         if (!isJobExist) return next(new ErrorResponse(404, "Job not found"));
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
