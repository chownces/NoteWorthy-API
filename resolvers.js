/**
 * This file defines the functions that will be used to query or modify
 * some data in MongoDB.
 */
import { AuthenticationError, UserInputError } from 'apollo-server-express';

import User from './models/user';
import Database from './models/database';
import Note from './models/note';

const assertAuthenticated = context => {
  if (!context.getUser()) {
    throw new AuthenticationError('You need to be logged in');
  }
};

const resolvers = {
  Query: {
    async getNote(root, { id }) {
      // RELOOK: assert authentication and user
      return await Note.findById(id);
    },
    async allUsers() {
      return await User.find();
    },
    async allNotes() {
      // RELOOK: assert authentication and filter by user
      return await Note.find();
    },
    async allDatabases(parent, args, context) {
      assertAuthenticated(context);

      // RELOOK
      return await Database.find();
    },
    currentUser: (parent, args, context) => context.getUser()
  },
  Mutation: {
    // NOTE: We use email as the unique id
    async register(root, { input }, context) {
      if (await User.findOne({ email: input.email })) {
        throw new UserInputError('Email has been taken');
      }
      const newUser = new User({
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        password: input.password,
        databases: []
      });

      await newUser.hashPassword();

      newUser.save((error, document) => {
        // TODO: Remove this console log
        if (error) console.error(error);
        console.log(document);
      });

      await context.login(newUser);

      return { user: newUser };
    },
    async createNote(root, { input }, context) {
      // RELOOK
      return await Note.create(input);
    },
    // TODO: Redo these update note functions
    async updateNoteTitle(root, { id, input }, context) {
      // RELOOK
      // TODO: Check deprecation warning
      return await Note.findOneAndUpdate({ _id: id }, input, {
        new: true,
        useFindAndModify: false
      });
    },
    async updateNoteBlocks(root, { id, input }, context) {
      // RELOOK
      // TODO: Check deprecation warning
      return await Note.findOneAndUpdate({ _id: id }, input, {
        new: true,
        useFindAndModify: false
      });
    },
    async deleteNote(root, { id }, context) {
      // RELOOK
      return await Note.findOneAndRemove({ _id: id });
    },
    async deleteAllUsers(root) {
      return await (await User.deleteMany()).ok;
    },
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate('graphql-local', { email, password });
      await context.login(user);
      return { user };
    },
    logout: (parent, args, context) => context.logout()
  }
};

export default resolvers;
