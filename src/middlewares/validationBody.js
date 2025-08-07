import createHttpError from 'http-errors';
import { bodyValidationSchema } from '../validation/contacts.js';

const validationBody = (schema) => async (request, response, next) => {
  try {
    await schema.validateAsync(request.body, { abortEarly: false });
    next();
  } catch (error) {
    const formattedErrors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    next(
      createHttpError(400, {
        message: 'Validation error',
        errors: formattedErrors,
      })
    );
  }
};

export const updateValidationBody = validationBody(bodyValidationSchema);
export const createValidationBody = validationBody(
  bodyValidationSchema.fork(['name', 'phoneNumber'], (field) => field.required())
);