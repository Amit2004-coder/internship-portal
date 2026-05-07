const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String, required: true },
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  skills: [{ type: String }],
  coverNote: { type: String },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

// One user can apply to one job only once
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
