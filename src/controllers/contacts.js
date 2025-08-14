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
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { isFavourite, type } = parseFilterParams(req.query);

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

  const paginationData = calculatePaginationData(totalItems, page, perPage);

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      ...paginationData,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id: ${req.params.contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body, req.user._id);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const contact = await updateContact(req.params.contactId, req.body, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(req.params.contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).end();
};