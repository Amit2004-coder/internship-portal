const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true, default: 'Remote' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'On-site'], default: 'Full-time' },
  duration: { type: String, trim: true }, // e.g. "3 months", "6 months"
  stipend: { type: String, trim: true }, // e.g. "₹15,000/month" or "Unpaid"
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  skills: [{ type: String }], // required skills
  openings: { type: Number, default: 1 },
  deadline: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
