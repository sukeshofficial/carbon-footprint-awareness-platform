import User from '../models/User.js';

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByGoogleId(googleId) {
    return await User.findOne({ googleId });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async findByResetToken(token) {
    return await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');
  }
}

export default new UserRepository();
