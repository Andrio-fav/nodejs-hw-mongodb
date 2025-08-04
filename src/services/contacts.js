import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({ page, perPage, filter, sort }) => {
  const skip = (page - 1) * perPage;

  const [data, totalItems] = await Promise.all([
    ContactsCollection.find(filter).sort(sort).skip(skip).limit(perPage),
    ContactsCollection.countDocuments(filter),
  ]);

  return { data, totalItems };
};

export const getContactById = async (id) => {
  return ContactsCollection.findById(id);
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (id, payload) => {
  return ContactsCollection.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteContact = async (id) => {
  return ContactsCollection.findByIdAndDelete(id);
};