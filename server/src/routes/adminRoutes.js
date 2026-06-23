import express from 'express';
import adminController from '../controllers/AdminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import AppError from '../utils/appError.js';

const router = express.Router();

/**
 * Middleware to restrict access to super admin only
 */
const restrictToSuperAdmin = (req, res, next) => {
  if (req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return next(new AppError('Access denied. Super Admin only.', 403));
  }
  next();
};

// All routes here are protected and restricted to super admin
router.use(protect);
router.use(restrictToSuperAdmin);

router.get('/users', adminController.getAllUsers);

export default router;
