const ProposalModel = require("../models/proposal");

module.exports = {
   createProposal: proposalData =>
      new Promise((resolve, reject) => {
         const proposal = new ProposalModel(proposalData);
         proposal.save((err, newProposal) => {
            err ? reject(err) : resolve(newProposal);
         });
      }),

   getProposals: developerId =>
      new Promise((resolve, reject) => {
         ProposalModel.find({ createdBy: developerId })
            .then(resolve)
            .catch(reject);
      }),
};
