import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId
) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const limit = perPage;

  const contactsQuery = ContactsCollection.find({ userId }); 

  if (typeof filter.type !== 'undefined') {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsQuery.clone().countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (id, userId) => {
  return ContactsCollection.findOne({ _id: id, userId }); 
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (id, payload, userId) => {
  return ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true }
  );
};

export const deleteContact = async (id, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: id, userId }); 
};