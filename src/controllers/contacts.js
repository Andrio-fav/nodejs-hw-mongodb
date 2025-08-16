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
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js'; 
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { isFavourite, type } = parseFilterParams(req.query) || {};

  const filter = {};
  if (isFavourite !== null) filter.isFavourite = isFavourite;
  if (type !== null) filter.contactType = type;

  const { data } = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    req.user._id
  );

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
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
  let photoUrl;

  if (req.file) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(req.file);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }
  }

  const contact = await createContact(
    { ...req.body, userId: req.user._id, photo: photoUrl },
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  let photoUrl;

  if (req.file) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(req.file);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }
  }

  const updatedData = { ...req.body };
  if (photoUrl) updatedData.photo = photoUrl;

  const contact = await updateContact(
    req.params.contactId,
    updatedData,
    req.user._id
  );

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
  const contact = await deleteContact(req.params.contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send(); 
};