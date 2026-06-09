import argon2 from 'argon2';

class PasswordService {
  /**
   * Hashes a plain text password using Argon2id.
   * @param {string} password 
   * @returns {Promise<string>}
   */
  async hash(password) {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
      });
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }

  /**
   * Verifies a plain text password against a hash.
   * @param {string} hash 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async verify(hash, password) {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      throw new Error('Error verifying password');
    }
  }
}

export default new PasswordService();
