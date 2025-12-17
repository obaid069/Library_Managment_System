import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-hospital-2024';

// Verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Check if user has required role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = [verifyToken, requireRole('admin')];

// Doctor only middleware
export const doctorOnly = [verifyToken, requireRole('doctor')];

// Staff only middleware
export const staffOnly = [verifyToken, requireRole('staff')];

// Patient only middleware
export const patientOnly = [verifyToken, requireRole('patient')];

// Doctor or Admin middleware
export const doctorOrAdmin = [verifyToken, requireRole('doctor', 'admin')];

// Staff or Admin middleware
export const staffOrAdmin = [verifyToken, requireRole('staff', 'admin')];

// Any authenticated user
export const authenticated = verifyToken;
