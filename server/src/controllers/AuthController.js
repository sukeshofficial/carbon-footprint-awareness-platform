import authService from '../services/AuthService.js';
import tokenService from '../security/TokenService.js';
import userRepository from '../repositories/UserRepository.js';
import { uploadAvatar } from '../services/cloudinary.service.js';

/**
 * Helper to set HTTP-only refresh token cookie
 */
const setRefreshTokenCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000;  // 7 days

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAge,
  });
};

class AuthController {
  async signup(req, res) {
    try {
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
    } catch (error) {
      let message = error.message;
      try {
        const parsed = JSON.parse(error.message);
        if (Array.isArray(parsed)) {
          message = parsed[0]?.message || 'Validation failed';
        }
      } catch (e) {
        // Not a JSON string
      }
      res.status(400).json({ status: 'error', message });
    }
  }

  async login(req, res) {
    try {
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
    } catch (error) {
      let message = error.message;
      try {
        const parsed = JSON.parse(error.message);
        if (Array.isArray(parsed)) {
          message = parsed[0]?.message || 'Invalid credentials';
        }
      } catch (e) {
        // Not a JSON string
      }
      res.status(401).json({ status: 'error', message });
    }
  }

  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ status: 'error', message: 'No refresh token' });
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
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      await authService.verifyEmail(req.params.token);
      res.status(200).json({
        status: 'success',
        message: 'Email verified successfully. You can now log in.',
      });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async logoutAll(req, res) {
    try {
      await authService.logoutAll(req.user.id);
      res.clearCookie('refreshToken');
      res.status(200).json({ status: 'success', message: 'Logged out from all devices' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await userRepository.findById(req.user.id);
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
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const ALLOWED = ['name', 'username', 'bio', 'avatar'];
      const update = {};

      for (const field of ALLOWED) {
        if (req.body[field] !== undefined) {
          update[field] = req.body[field];
        }
      }

      // If avatar is a base64 data URI, upload to Cloudinary
      if (update.avatar && update.avatar.startsWith('data:image')) {
        const publicId = `user_${req.user.id}`;
        update.avatar = await uploadAvatar(update.avatar, publicId);
      }

      if (!update.username && update.username !== undefined) {
        return res.status(400).json({ status: 'error', message: 'Username cannot be empty.' });
      }

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
      const isDuplicate = error.code === 11000;
      const field = isDuplicate ? Object.keys(error.keyPattern || {})[0] : null;
      const message = isDuplicate
        ? `That ${field} is already taken.`
        : error.message;
      res.status(isDuplicate ? 409 : 400).json({ status: 'error', message });
    }
  }

  async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body.email);
      res.status(200).json({
        status: 'success',
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    } catch (error) {
      let message = error.message;
      try {
        const parsed = JSON.parse(error.message);
        if (Array.isArray(parsed)) {
          message = parsed[0]?.message || 'Request failed';
        }
      } catch (e) {
        // Not a JSON string
      }
      res.status(400).json({ status: 'error', message });
    }
  }

  async resetPassword(req, res) {
    try {
      await authService.resetPassword(req.params.token, req.body.password);
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful. You can now log in with your new password.',
      });
    } catch (error) {
      let message = error.message;
      try {
        const parsed = JSON.parse(error.message);
        if (Array.isArray(parsed)) {
          message = parsed[0]?.message || 'Reset failed';
        }
      } catch (e) {
        // Not JSON
      }
      res.status(400).json({ status: 'error', message });
    }
  }
}

export default new AuthController();
