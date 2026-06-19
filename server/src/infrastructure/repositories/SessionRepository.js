import mongoose from 'mongoose';
import Session from '../models/Session.js';
import logger from '../../utils/logger.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class SessionRepository {
  async create(sessionData) {
    try {
      return await Session.create({
        userId: sessionData.userId,
        refreshToken: sessionData.refreshToken,
        userAgent: sessionData.userAgent,
        ipAddress: sessionData.ipAddress,
        expiresAt: sessionData.expiresAt
      });
    } catch (error) {
      logger.error('SessionRepository.create error', { error, userId: sessionData.userId });
      throw error;
    }
  }

  async findByToken(refreshToken) {
    try {
      return await Session.findOne({ refreshToken: String(refreshToken) });
    } catch (error) {
      logger.error('SessionRepository.findByToken error', { error });
      throw error;
    }
  }

  async updateToken(oldToken, newToken, expiresAt) {
    try {
      return await Session.findOneAndUpdate(
        { refreshToken: String(oldToken) },
        {
          refreshToken: String(newToken),
          expiresAt
        },
        { new: true }
      );
    } catch (error) {
      logger.error('SessionRepository.updateToken error', { error });
      throw error;
    }
  }

  async deleteByToken(refreshToken) {
    try {
      return await Session.findOneAndDelete({ refreshToken: String(refreshToken) });
    } catch (error) {
      logger.error('SessionRepository.deleteByToken error', { error });
      throw error;
    }
  }

  async deleteAllByUserId(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ID provided to SessionRepository');
      }
      return await Session.deleteMany({ userId });
    } catch (error) {
      logger.error('SessionRepository.deleteAllByUserId error', { error, userId });
      throw error;
    }
  }
}

export default new SessionRepository();
