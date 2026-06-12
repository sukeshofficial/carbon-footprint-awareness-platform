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

    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already in use');
    }

    const hashedPassword = await passwordService.hash(userData.password);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return user;
  }

  /**
   * Verifies user email.
   */
  async verifyEmail(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findByVerificationToken(hashedToken);

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    await userRepository.update(user._id, {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });

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

    // 1. Check if new password is the same as current password
    const isSameAsCurrent = await passwordService.verify(user.password, newPassword);
    if (isSameAsCurrent) {
      throw new Error('Please enter a DIFFERENT password that you have not used recently.');
    }

    // 2. Check if new password exists in history
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const entry of user.passwordHistory) {
        const isMatch = await passwordService.verify(entry.password, newPassword);
        if (isMatch) {
          const daysAgo = Math.floor((Date.now() - new Date(entry.changedAt).getTime()) / (1000 * 60 * 60 * 24));
          const timeText = daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
          throw new Error(`You have already used this password. You last changed to this password ${timeText}.`);
        }
      }
    }

    // 3. Prepare old password to be pushed to history
    const oldPasswordEntry = {
      password: user.password,
      changedAt: new Date(),
    };

    const hashedPassword = await passwordService.hash(newPassword);

    // 4. Update user with new password and push old to history
    await userRepository.update(user._id, {
      password: hashedPassword,
      $push: { passwordHistory: oldPasswordEntry },
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    // Optionally logout all sessions after password change
    await sessionRepository.deleteAllByUserId(user._id);
  }
}

export default new AuthService();
