const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, hrOnly } = require('../middleware/auth');

// Apply to a job (user only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Only users can apply' });

    const { jobId, resumeUrl, githubUrl, linkedinUrl, skills, coverNote } = req.body;

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      skills: skills || [],
      coverNote,
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's own applications
router.get('/my', protect, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type stipend duration')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications for a specific job (HR only)
router.get('/job/:jobId', protect, hrOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone skills githubUrl linkedinUrl resumeUrl')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status (HR only)
router.patch('/:id/status', protect, hrOnly, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    app.status = req.body.status;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if user applied to a job
router.get('/check/:jobId', protect, async (req, res) => {
  try {
    const app = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    res.json({ applied: !!app, application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
