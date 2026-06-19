import logger from '../utils/logger.js';
import AppError from '../utils/appError.js';

/**
 * Middleware factory for validating request data against Zod schemas.
 * Validates body, query, and params.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const dataToValidate = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    console.log('[DEBUG] Validation input body:', JSON.stringify(req.body));

    const validated = schema.parse(dataToValidate);

    // Replace request properties with validated/sanitized data
    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;

    next();
  } catch (err) {
    logger.debug('[Validation] Request validation failed:', err);

    if (err.errors) {
      const details = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation failed: ${details}`, 400));
    }

    next(err);
  }
};
