import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class TokenService {
  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key-change-me';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-me';
    this.accessTokenExpiresIn = '15m'; // 15 minutes
    this.refreshTokenExpiresIn = '7d'; // 7 days
  }

  /**
   * Generates Access and Refresh tokens for a user.
   * @param {Object} user 
   * @returns {Object} { accessToken, refreshToken }
   */
  generateTokens(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign({ id: user._id }, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verifies an access token.
   * @param {string} token 
   * @returns {Object} payload
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecret);
    } catch (error) {
      console.error('Access token verification failed:', error.message);
      return null;
    }
  }

  /**
   * Verifies a refresh token.
   * @param {string} token 
   * @returns {Object} payload
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      console.error('Refresh token verification failed:', error.message);
      return null;
    }
  }
}

export default new TokenService();
