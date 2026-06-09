/**
 * Middleware to validate request body using Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.errors?.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })) || [{ message: error.message }],
    });
  }
};
