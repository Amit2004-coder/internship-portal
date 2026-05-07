const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, phone, password, skills, company, githubUrl, linkedinUrl, resumeUrl } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ role, name, email, phone, password, skills: skills || [], company, githubUrl, linkedinUrl, resumeUrl });
    res.status(201).json({ _id: user._id, role: user.role, name: user.name, email: user.email, skills: user.skills, company: user.company, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ _id: user._id, role: user.role, name: user.name, email: user.email, skills: user.skills, company: user.company, phone: user.phone, githubUrl: user.githubUrl, linkedinUrl: user.linkedinUrl, resumeUrl: user.resumeUrl, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
