import { bodyValidationSchema } from '../validation/contacts.js';

const validationBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error.details) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        errors
      });
    }
    next(error);
  }
};

export const createValidationBody = validationBody(bodyValidationSchema);
export const updateValidationBody = validationBody(bodyValidationSchema);
