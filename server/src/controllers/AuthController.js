import authService from '../services/AuthService.js';
import userRepository from '../infrastructure/repositories/UserRepository.js';
import streakService from '../services/streak.service.js';
import { uploadAvatar } from '../services/cloudinary.service.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * Helper to set HTTP-only refresh token cookie
 */
const setRefreshTokenCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000;  // 7 days

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true, // Always true — SameSite=None requires Secure
    sameSite: 'none', // Required for cross-origin cookie (frontend and backend on different domains)
    maxAge: maxAge,
  });
};

class AuthController {
  signup = catchAsync(async (req, res, next) => {
    const user = await authService.signup(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  });

  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
      userAgent,
      ipAddress
    );

    const rememberMe = req.body.rememberMe === true;
    setRefreshTokenCookie(res, refreshToken, rememberMe);

    // Update login streak (fire-and-forget — must not break login on failure)
    streakService.updateStreakOnLogin(user._id).catch((err) =>
      console.error('[StreakService] Failed to update login streak:', err)
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          googleAvatar: user.googleAvatar,
          googleId: user.googleId,
          bio: user.bio,
          role: user.role,
        },
        accessToken,
      },
    });
  });

  refresh = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(
      refreshToken,
      userAgent,
      ipAddress
    );

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      status: 'success',
      data: { accessToken },
    });
  });

  verifyEmail = catchAsync(async (req, res, next) => {
    await authService.verifyEmail(req.params.token);
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now log in.',
    });
  });

  logout = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  });

  logoutAll = catchAsync(async (req, res, next) => {
    await authService.logoutAll(req.user.id);
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success', message: 'Logged out from all devices' });
  });

  getMe = catchAsync(async (req, res, next) => {
    const user = await userRepository.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          googleAvatar: user.googleAvatar,
          googleId: user.googleId,
          bio: user.bio,
          role: user.role,
        },
      },
    });
  });

  updateMe = catchAsync(async (req, res, next) => {
    const ALLOWED = ['name', 'username', 'bio', 'avatar'];
    const update = {};

    for (const field of ALLOWED) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    if (update.avatar?.startsWith('data:image')) {
      const publicId = `user_${req.user.id}`;
      update.avatar = await uploadAvatar(update.avatar, publicId);
    }

    if (!update.username && update.username !== undefined) {
      return next(new AppError('Username cannot be empty.', 400));
    }

    try {
      const user = await userRepository.update(req.user.id, update);
      res.status(200).json({
        status: 'success',
        message: 'Account updated successfully.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            googleAvatar: user.googleAvatar,
            googleId: user.googleId,
            bio: user.bio,
            role: user.role,
          },
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        return next(new AppError(`That ${field} is already taken.`, 409));
      }
      throw error;
    }
  });

  forgotPassword = catchAsync(async (req, res, next) => {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      status: 'success',
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  });

  resetPassword = catchAsync(async (req, res, next) => {
    await authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now log in with your new password.',
    });
  });
}

export default new AuthController();

