import User from '../models/User.js';

export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', ward: req.user.ward }).select('-password');
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};