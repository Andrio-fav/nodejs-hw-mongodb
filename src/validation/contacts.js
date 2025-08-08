import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': '"name" must be a string',
      'string.empty': '"name" is required',
      'string.min': '"name" must be at least {#limit} characters',
      'string.max': '"name" must be at most {#limit} characters',
      'any.required': '"name" is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': '"email" must be a string',
      'string.email': '"email" must be a valid email address',
      'any.required': '"email" is required',
    }),

  phone: Joi.string()
    .pattern(/^[0-9\-+\s()]*$/)
    .required()
    .messages({
      'string.base': '"phone" must be a string',
      'string.empty': '"phone" is required',
      'string.pattern.base': '"phone" must contain only numbers, spaces, dashes, or parentheses',
      'any.required': '"phone" is required',
    }),

  favorite: Joi.boolean()
    .messages({
      'boolean.base': '"favorite" must be a boolean',
    }),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.base': '"name" must be a string',
      'string.min': '"name" must be at least {#limit} characters',
      'string.max': '"name" must be at most {#limit} characters',
    }),

  email: Joi.string()
    .email()
    .messages({
      'string.base': '"email" must be a string',
      'string.email': '"email" must be a valid email address',
    }),

  phone: Joi.string()
    .pattern(/^[0-9\-+\s()]*$/)
    .messages({
      'string.base': '"phone" must be a string',
      'string.pattern.base': '"phone" must contain only numbers, spaces, dashes, or parentheses',
    }),

  favorite: Joi.boolean()
    .messages({
      'boolean.base': '"favorite" must be a boolean',
    }),
}).min(1);
