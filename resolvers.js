/**
 * This file defines the functions that will be used to query or modify
 * some data in MongoDB.
 */
import Note from './models/note';

export const resolvers = {
  Query: {
    async getNote(root, { id }) {
      return await Note.findById(id);
    },
    async allNotes() {
      return await Note.find();
    }
  },
  Mutation: {
    async createNote(root, { input }) {
      return await Note.create(input);
    },
    async updateNote(root, { id, input }) {
      // TODO: Check deprecation warning
      return await Note.findOneAndUpdate({ _id: id }, input, { new: true, useFindAndModify: false });
    },
    async deleteNote(root, { id }) {
      return await Note.findOneAndRemove({ _id: id });
    },
    async deleteAll(root) {
      return await Note.deleteMany();
    }
  }
};
