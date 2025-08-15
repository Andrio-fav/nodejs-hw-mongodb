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
  const { isFavourite, type } = parseFilterParams(req.query) || {}; 

  const filter = {};
  if (isFavourite !== null) filter.isFavourite = isFavourite;
  if (type !== null) filter.contactType = type;

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const { data, totalItems } = await getAllContacts(req.user._id, {
    page,
    perPage,
    filter,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: data,
  });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  const { id, ...contactData } = contact.toObject ? contact.toObject() : contact;

  res.json({
    status: 200,
    message: `Successfully found contact with id: ${req.params.id}!`,
    data: contactData,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body, req.user._id);
  const { id, ...contactData } = contact.toObject ? contact.toObject() : contact; 
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contactData,
  });
};

export const updateContactController = async (req, res) => {
  const contact = await updateContact(req.params.contactId, req.body, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  const { id, ...contactData } = contact.toObject ? contact.toObject() : contact;

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contactData,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(req.params.contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  const { id, ...contactData } = contact.toObject ? contact.toObject() : contact;

  res.status(204).json({
    status: 204,
    message: 'Successfully deleted a contact!',
    data: contactData,
  });
};