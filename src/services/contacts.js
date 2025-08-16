import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const limit = perPage;

  const query = { userId };

  if (typeof filter.type !== 'undefined') {
    query.contactType = filter.type;
  }
  if (typeof filter.isFavourite !== 'undefined') {
    query.isFavourite = filter.isFavourite;
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments(query),
    ContactsCollection.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts.map(contact => contact.toJSON()), ...paginationData };
};

export const getContactById = async (id, userId) => {
  const contact = await ContactsCollection.findOne({ _id: id, userId });
  return contact ? contact.toJSON() : null;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact.toJSON();
};

export const updateContact = async (id, payload, userId) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return contact ? contact.toJSON() : null;
};

export const deleteContact = async (id, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: id, userId });
  return contact ? contact.toJSON() : null;
};