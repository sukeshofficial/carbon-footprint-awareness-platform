import mongoose from 'mongoose';
import User from '../models/User.js';
import logger from '../../utils/logger.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class UserRepository {
  async findByEmail(email) {
    try {
      return await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    } catch (error) {
      logger.error('UserRepository.findByEmail error', { error });
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      return await User.findOne({ username: String(username) });
    } catch (error) {
      logger.error('UserRepository.findByUsername error', { error });
      throw error;
    }
  }

  async findById(id) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid user ID');
      return await User.findById(id);
    } catch (error) {
      logger.error('UserRepository.findById error', { error, id });
      throw error;
    }
  }

  async findByGoogleId(googleId) {
    try {
      return await User.findOne({ googleId: String(googleId) });
    } catch (error) {
      logger.error('UserRepository.findByGoogleId error', { error });
      throw error;
    }
  }

  async create(userData) {
    try {
      return await User.create({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        googleId: userData.googleId,
        isVerified: userData.isVerified,
        // Add other explicit fields as per model if needed, 
        // but sticking to common ones for now
        ...userData
      });
    } catch (error) {
      logger.error('UserRepository.create error', { error });
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      if (!isValidObjectId(id)) throw new Error('Invalid user ID');
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      logger.error('UserRepository.update error', { error, id });
      throw error;
    }
  }

  async findByResetToken(token) {
    try {
      return await User.findOne({
        passwordResetToken: String(token),
        passwordResetExpires: { $gt: Date.now() },
      }).select('+password +passwordHistory');
    } catch (error) {
      logger.error('UserRepository.findByResetToken error', { error });
      throw error;
    }
  }

  async findByVerificationToken(token) {
    try {
      return await User.findOne({
        verificationToken: String(token),
        verificationTokenExpires: { $gt: Date.now() },
      });
    } catch (error) {
      logger.error('UserRepository.findByVerificationToken error', { error });
      throw error;
    }
  }

  async findAll() {
    try {
      return await User.find().sort({ createdAt: -1 });
    } catch (error) {
      logger.error('UserRepository.findAll error', { error });
      throw error;
    }
  }
}

export default new UserRepository();
