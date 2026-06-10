import { OAuth2Client } from 'google-auth-library';
import userRepository from '../repositories/UserRepository.js';
import authService from '../services/AuthService.js';
import sessionRepository from '../repositories/SessionRepository.js';
import tokenService from '../security/TokenService.js';

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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

class GoogleController {
  /**
   * Redirect to Google Consent Screen
   */
  async googleAuth(req, res) {
    const client = getOAuth2Client();
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      prompt: 'consent',
    });
    res.json({ url });
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
          user = await userRepository.update(user._id, { googleId, avatar });
        } else {
          user = await userRepository.create({
            name,
            email,
            googleId,
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

      // Redirect back to frontend
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}`);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
}

export default new GoogleController();
