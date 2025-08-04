import JoiValidation from 'joi';

export const bodyValidationSchema = JoiValidation.object({
  name: JoiValidation.string().min(3).max(20),
  // .messages({
  // 'string.base': 'Username should be a string',
  // 'string.min': 'Username should have at least {#limit} characters',
  // 'string.max': 'Username should have at most {#limit} characters',
  // })
  phoneNumber: JoiValidation.string()
    .min(3)
    .max(20)
    .pattern(/^[\d\s()+-]+$/),
  email: JoiValidation.string().min(3).max(20).email(),
  isFavourite: JoiValidation.boolean(),
  contactType: JoiValidation.string().valid('work', 'home', 'personal'),
});