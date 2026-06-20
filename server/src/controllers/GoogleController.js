import { randomInt } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import userRepository from '../infrastructure/repositories/UserRepository.js';
import authService from '../services/AuthService.js';
import sessionRepository from '../infrastructure/repositories/SessionRepository.js';
import tokenService from '../security/TokenService.js';
import streakService from '../services/streak.service.js';

let oauth2Client;

const getOAuth2Client = () => {
  if (!oauth2Client) {
    oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
  }
  return oauth2Client;
};

/**
 * Helper to set HTTP-only refresh token cookie
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true, // Always true — SameSite=None requires Secure
    sameSite: 'none', // Required for cross-origin cookie (frontend and backend on different domains)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

class GoogleController {
  /**
   * Redirect to Google Consent Screen
   */
  async googleAuth(req, res) {
    try {
      const client = getOAuth2Client();

      // Basic validation of credentials
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error('Missing Google OAuth credentials in environment variables');
        return res.status(500).json({
          status: 'error',
          message: 'Google OAuth is not properly configured on the server.'
        });
      }

      const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        prompt: 'consent',
      });
      res.json({ url });
    } catch (error) {
      console.error('Google Auth Initialization Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to initialize Google authentication.',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  /**
   * Google Callback Handler
   */
  async googleCallback(req, res) {
    const { code } = req.query;
    const client = getOAuth2Client();

    try {
      const { tokens: googleTokens } = await client.getToken(code);
      client.setCredentials(googleTokens);

      const ticket = await client.verifyIdToken({
        idToken: googleTokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { sub: googleId, email, name, picture: avatar } = ticket.getPayload();

      let user = await userRepository.findByGoogleId(googleId);

      if (!user) {
        // Match existing account by email or create new
        user = await userRepository.findByEmail(email);
        if (user) {
          user = await userRepository.update(user._id, {
            googleId,
            googleAvatar: avatar,
            avatar: user.avatar || avatar
          });
        } else {
          // Create new user with generated username
          const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
          const randomSuffix = randomInt(1000, 10000);
          const username = `${baseUsername}${randomSuffix}`;

          user = await userRepository.create({
            name,
            username,
            email,
            googleId,
            googleAvatar: avatar,
            avatar,
            isVerified: true, // Google accounts are verified
          });
        }
      }

      const tokens = tokenService.generateTokens(user);

      // Store session
      await sessionRepository.create({
        userId: user._id,
        refreshToken: tokens.refreshToken,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      setRefreshTokenCookie(res, tokens.refreshToken);

      // Update login streak (fire-and-forget)
      streakService.updateStreakOnLogin(user._id).catch((err) =>
        console.error('[StreakService] Failed to update Google login streak:', err)
      );

      // Redirect back to frontend
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}`);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
}

export default new GoogleController();
