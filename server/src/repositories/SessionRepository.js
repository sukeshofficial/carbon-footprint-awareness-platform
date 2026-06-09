import Session from '../models/Session.js';

class SessionRepository {
  async create(sessionData) {
    return await Session.create(sessionData);
  }

  async findByToken(refreshToken) {
    return await Session.findOne({ refreshToken });
  }

  async updateToken(oldToken, newToken, expiresAt) {
    return await Session.findOneAndUpdate(
      { refreshToken: oldToken },
      { refreshToken: newToken, expiresAt },
      { new: true }
    );
  }

  async deleteByToken(refreshToken) {
    return await Session.findOneAndDelete({ refreshToken });
  }

  async deleteAllByUserId(userId) {
    return await Session.deleteMany({ userId });
  }
}

export default new SessionRepository();
