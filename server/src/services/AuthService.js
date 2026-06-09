import crypto from 'crypto';
import userRepository from '../repositories/UserRepository.js';
import sessionRepository from '../repositories/SessionRepository.js';
import passwordService from '../security/PasswordService.js';
import tokenService from '../security/TokenService.js';
import * as emailService from './email.service.js';

class AuthService {
  /**
   * Handles user signup.
   */
  async signup(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await passwordService.hash(userData.password);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // We don't log in automatically here to force verification if needed, 
    // but for now, we'll return the user.
    return user;
  }

  /**
   * Handles user login.
   */
  async login(email, password, userAgent, ipAddress) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await passwordService.verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const tokens = tokenService.generateTokens(user);

    // Store session in DB
    await sessionRepository.create({
      userId: user._id,
      refreshToken: tokens.refreshToken,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { user, ...tokens };
  }

  /**
   * Refreshes access token using refresh token.
   */
  async refreshTokens(refreshToken, userAgent, ipAddress) {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const session = await sessionRepository.findByToken(refreshToken);
    if (!session) {
      throw new Error('Session not found or expired');
    }

    const user = await userRepository.findById(payload.id);
    if (!user) {
      throw new Error('User not found');
    }

    const tokens = tokenService.generateTokens(user);

    // Rotate refresh token: Update old session with new token
    await sessionRepository.updateToken(
      refreshToken,
      tokens.refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    return tokens;
  }

  /**
   * Logs out from current session.
   */
  async logout(refreshToken) {
    await sessionRepository.deleteByToken(refreshToken);
  }

  /**
   * Logs out from all sessions.
   */
  async logoutAll(userId) {
    await sessionRepository.deleteAllByUserId(userId);
  }

  /**
   * Generates password reset token and sends email.
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await userRepository.update(user._id, {
      passwordResetToken: hashedResetToken,
      passwordResetExpires: Date.now() + 3600000, // 1 hour
    });

    await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  /**
   * Resets password using token.
   */
  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    const hashedPassword = await passwordService.hash(newPassword);
    await userRepository.update(user._id, {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    // Optionally logout all sessions after password change
    await sessionRepository.deleteAllByUserId(user._id);
  }
}

export default new AuthService();
