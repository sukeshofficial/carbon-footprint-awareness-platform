import authService from '../services/AuthService.js';
import tokenService from '../security/TokenService.js';
import userRepository from '../repositories/UserRepository.js';

/**
 * Helper to set HTTP-only refresh token cookie
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
      res.status(400).json({ status: 'error', message: error.message });
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

      setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error) {
      res.status(401).json({ status: 'error', message: error.message });
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
      res.status(401).json({ status: 'error', message: error.message });
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
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
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
      res.status(400).json({ status: 'error', message: error.message });
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
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export default new AuthController();
