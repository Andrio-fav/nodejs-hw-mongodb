import Joi from 'joi';

export const bodyValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .messages({
      'string.base': '"name" must be a string',
      'string.min': '"name" must be at least {#limit} characters',
      'string.max': '"name" must be at most {#limit} characters',
    }),

  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[\d\s()+-]+$/)
    .messages({
      'string.base': '"phoneNumber" must be a string',
      'string.min': '"phoneNumber" must be at least {#limit} characters',
      'string.max': '"phoneNumber" must be at most {#limit} characters',
      'string.pattern.base':
        '"phoneNumber" must contain only digits, spaces, parentheses, plus or minus signs',
    }),

  email: Joi.string()
    .min(3)
    .max(50)
    .email()
    .messages({
      'string.base': '"email" must be a string',
      'string.min': '"email" must be at least {#limit} characters',
      'string.max': '"email" must be at most {#limit} characters',
      'string.email': '"email" must be a valid email address',
    }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': '"isFavourite" must be a boolean',
  }),

  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .messages({
      'string.base': '"contactType" must be a string',
      'any.only': '"contactType" must be one of [work, home, personal]',
    }),
});