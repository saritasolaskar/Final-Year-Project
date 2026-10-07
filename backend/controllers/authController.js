import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerCitizen = async (req, res) => {
  try {
    const { name, email, password, ward } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Resident with this email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'citizen',
      ward: ward || 'Prabhag 01 - Bhosari Gaothan / Landewadi',
      constituency: 'Bhosari (AC 207)',
    });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, ward: user.ward, constituency: user.constituency },
      process.env.JWT_SECRET || 'pcmc_bhosari_verified_secret_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, ward: user.ward, constituency: user.constituency } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid PCMC / Bhosari credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid PCMC / Bhosari credentials.' });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, ward: user.ward, constituency: user.constituency, department: user.department },
      process.env.JWT_SECRET || 'pcmc_bhosari_verified_secret_2026',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward,
        constituency: user.constituency,
        department: user.department,
        shiftStatus: user.shiftStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};