import bcrypt from 'bcryptjs';

class PasswordService {
  /**
   * Hashes a plain text password using Argon2id.
   * @param {string} password 
   * @returns {Promise<string>}
   */
  async hash(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Error hashing password', { cause: error });
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
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Error verifying password', { cause: error });
    }
  }
}

export default new PasswordService();
