import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async (userId, { page, perPage, filter, sort }) => {
  const skip = (page - 1) * perPage;
  const userFilter = { ...filter, userId };

  const [data, totalItems] = await Promise.all([
    ContactsCollection.find(userFilter).sort(sort).skip(skip).limit(perPage),
    ContactsCollection.countDocuments(userFilter),
  ]);

  return { data, totalItems };
};

export const getContactById = async (id, userId) => {
  return ContactsCollection.findOne({ _id: id, userId });
};

export const createContact = async (payload, userId) => {
  return ContactsCollection.create({ ...payload, userId });
};

export const updateContact = async (id, payload, userId) => {
  return ContactsCollection.findOneAndUpdate({ _id: id, userId }, payload, { new: true });
};

export const deleteContact = async (id, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: id, userId });
};