import createHttpError from 'http-errors';
import { bodyValidationSchema } from '../validation/contacts.js';

const validationBody = (schema) => async (request, response, next) => {
  try {
    await schema.validateAsync(request.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path.join('.'),
    }));

    next(createHttpError(400, 'Validation error', { errors }));
  }
};

export const updateValidationBody = validationBody(bodyValidationSchema);
export const createValidationBody = validationBody(
  bodyValidationSchema.fork(['name', 'phoneNumber'], (field) => field.required())
);