const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || null;
    req.admin = decoded.admin || null;
    if (!req.user && !req.admin) return res.status(401).json({ message: 'Invalid token' });
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

exports.requireAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) return res.status(401).json({ message: 'Not authorized as admin' });
    req.admin = decoded.admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Admin token invalid' });
  }
};
