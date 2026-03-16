const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || null;
    req.isAdmin = decoded.isAdmin || false;
    if (!req.user) return res.status(401).json({ message: 'Invalid token' });
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
    if (!decoded.isAdmin) return res.status(401).json({ message: 'Not authorized as admin' });
    req.user = decoded.user;
    req.isAdmin = true;
    next();
  } catch {
    return res.status(401).json({ message: 'Admin token invalid' });
  }
};
