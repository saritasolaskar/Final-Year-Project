import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No PCMC authentication token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pcmc_bhosari_verified_secret_2026');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired PCMC session token.' });
  }
};