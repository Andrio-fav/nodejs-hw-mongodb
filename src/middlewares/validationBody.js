import createHttpError from 'http-errors';
import { bodyValidationSchema } from '../validation/contacts.js';

const validationBody = (schema) => async (request, response, next) => {
  try {
    await schema.validateAsync(request.body, { abortEarly: false });
    next();
  } catch (error) {
    const validationError = createHttpError(400, 'Bad request', { errors: error.details });
    next(validationError);
  }
};

export const updateValidationBody = validationBody(bodyValidationSchema);
export const createValidationBody = validationBody(
  bodyValidationSchema.fork(['name', 'phoneNumber'], (field) => field.required())
);