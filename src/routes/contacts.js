import { Router } from 'express';

import {
  createContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createValidationBody, updateValidationBody } from '../middlewares/validationBody.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', createValidationBody, ctrlWrapper(createContactController));
router.patch('/:contactId', isValidId, updateValidationBody, ctrlWrapper(updateContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;