import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    req.user.id,
  );
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.id, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id: ${req.params.id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact({ ...req.body, userId: req.user.id });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const contact = await updateContact(req.params.id, req.body, req.user.id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(req.params.id, req.user.id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).json({
    status: 204,
    message: 'Successfully deleted a contact!',
    data: contact,
  });
};