const JobModel = require("../models/job");

module.exports = {
   createJob: jobData =>
      new Promise((resolve, reject) => {
         const job = new JobModel(jobData);
         job.save((err, newJob) => {
            err ? reject(err) : resolve(newJob);
         });
      }),

   getJobs: buyerId =>
      new Promise((resolve, reject) => {
         JobModel.find({ authoId: buyerId }).then(resolve).catch(reject);
      }),
};
