import createHttpError from 'http-errors';
import { createContactsSchema, updateContactsSchema } from '../validation/contacts.js';

const validationBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path.join('.'),
    }));

    next(createHttpError(400, 'Validation error', { errors }));
  }
};

export const createValidationBody = validationBody(createContactsSchema);
export const updateValidationBody = validationBody(updateContactsSchema);
