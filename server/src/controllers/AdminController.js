import userRepository from '../infrastructure/repositories/UserRepository.js';
import Profile from '../infrastructure/models/profile.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

class AdminController {
  /**
   * Get all users with their profiles
   */
  getAllUsers = catchAsync(async (req, res, next) => {
    // Check if the requester is the super admin (extra layer of safety)
    if (req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    // Fetch all users
    const users = await userRepository.findAll();

    // Fetch all profiles and create a map for easy lookup
    const profiles = await Profile.find({});
    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.userId.toString()] = profile;
      return acc;
    }, {});

    // Combine user and profile data
    const usersWithProfiles = users.map(user => {
      const profile = profileMap[user._id.toString()] || null;
      return {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        profile: profile
      };
    });

    res.status(200).json({
      status: 'success',
      results: usersWithProfiles.length,
      data: {
        users: usersWithProfiles
      }
    });
  });
}

export default new AdminController();
