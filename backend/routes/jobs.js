const router = require('express').Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, hrOnly } = require('../middleware/auth');

// GET all jobs (public) with search + filter
router.get('/', async (req, res) => {
  try {
    const { search, skill, type, location } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (type && type !== 'all') query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };

    const jobs = await Job.find(query).populate('postedBy', 'name company email').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create job (HR only)
router.post('/', protect, hrOnly, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id, company: req.body.company || req.user.company });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update job (HR only, own job)
router.put('/:id', protect, hrOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your job post' });
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE job (HR only, own job)
router.delete('/:id', protect, hrOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your job post' });
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job: req.params.id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET HR's own jobs
router.get('/hr/my-jobs', protect, hrOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
