import profileService from '../services/profile.service.js';
import { createProfileValidator, updateProfileValidator, patchPreferencesValidator } from '../validators/profile.validator.js';

class ProfileController {
  async createProfileController(req, res) {
    try {
      // Validate input
      const validatedData = createProfileValidator.parse(req.body);

      const userId = req.user.id;
      const profile = await profileService.createProfile(userId, validatedData);

      res.status(201).json({
        status: 'success',
        data: { profile }
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async getProfileController(req, res) {
    try {
      const userId = req.user.id;
      const profile = await profileService.getProfile(userId);

      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: { profile }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async updateProfileController(req, res) {
    try {
      // Validate input
      const validatedData = updateProfileValidator.parse(req.body);

      const userId = req.user.id;
      const profile = await profileService.updateProfile(userId, validatedData);

      res.status(200).json({
        status: 'success',
        data: { profile }
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async patchPreferencesController(req, res) {
    try {
      // Validate input
      const validatedData = patchPreferencesValidator.parse(req.body);

      const userId = req.user.id;
      const profile = await profileService.patchPreferences(userId, validatedData);

      res.status(200).json({
        status: 'success',
        data: { profile }
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

export default new ProfileController();
