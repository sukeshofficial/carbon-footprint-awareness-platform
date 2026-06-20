import tokenService from '../security/TokenService.js';
import userRepository from '../infrastructure/repositories/UserRepository.js';

/**
 * Protect routes - ensures user is logged in
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'You are not logged in' });
    }

    const decoded = tokenService.verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }

    const currentUser = await userRepository.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'error', message: 'The user belonging to this token no longer exists' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
};

/**
 * Restrict access to certain roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
