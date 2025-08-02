import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = ContactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = ContactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (id) => {
  const contact = ContactsCollection.findByIdAndDelete(id);
  return contact;
};