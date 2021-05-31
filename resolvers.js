/**
 * This file defines the functions that will be used to query or modify
 * some data in MongoDB.
 */
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';

import User from './models/user';
import Database from './models/database';
import Note from './models/note';

// NOTE: We use email as the unique id for user
const resolvers = {
  Query: {
    getNote: async (parent, { noteId }, context) => {
      assertAuthenticated(context);
      await verifyNoteBelongsToUser(context, noteId);

      return await Note.findById(noteId);
    },
    getAllNotesInDatabase: async (parent, { databaseId }, context) => {
      assertAuthenticated(context);
      await verifyDatabaseBelongsToUser(context, databaseId);

      const databaseDocument = await Database.findOne({ _id: databaseId }).populate('notes');

      return databaseDocument.notes;
    },
    getAllUserDatabases: async (parent, args, context) => {
      assertAuthenticated(context);

      const email = context.getUser().email;
      const userDocument = await User.findOne({ email: email }).populate('databases');

      return userDocument.databases;
    },
    currentUser: (parent, args, context) => context.getUser()
  },
  Mutation: {
    // ================== Authentication related ==================
    login: async (parent, { email, password }, context) => {
      // TODO: Handle authentication failure
      const { user } = await context.authenticate('graphql-local', { email, password });
      await context.login(user);
      console.log(context.getUser());
      return { user };
    },
    logout: (parent, args, context) => context.logout(),
    register: async (root, { input }, context) => {
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

    // ================== Database related ==================
    // TODO: Handle the ordering of the databases
    createDatabase: async (parent, args, context) => {
      assertAuthenticated(context);

      const email = context.getUser().email;
      const userDocument = await User.findOne({ email: email });

      const newDatabase = await new Database({
        // TODO: Double check defaults
        title: 'untitled',
        currentView: 'table',
        notes: []
      }).save();

      userDocument.databases.push(newDatabase._id);
      await userDocument.save();

      // TODO: Check whether to return a boolean instead
      return newDatabase;
    },
    deleteDatabase: async (parent, { databaseId }, context) => {
      assertAuthenticated(context);
      await verifyDatabaseBelongsToUser(context, databaseId);

      const deletedDatabase = await Database.findOneAndRemove(
        { _id: databaseId },
        {
          useFindAndModify: false
        }
      );

      const email = context.getUser().email;
      const userDocument = await User.findOne({ email: email });
      arrayRemoveItem(userDocument.databases, databaseId);

      await userDocument.save();
      return deletedDatabase;
    },
    updateDatabaseTitle: async (parent, { databaseId, title }, context) => {
      assertAuthenticated(context);
      await verifyDatabaseBelongsToUser(context, databaseId);

      return await Database.findOneAndUpdate(
        { _id: databaseId },
        { title: title },
        {
          new: true,
          useFindAndModify: false
        }
      );
    },
    // TODO: updateDatabaseView
    // TODO: updateDatabaseNotes (array of IDs)

    // ================== Note related ==================
    // TODO: Handle the ordering of the notes
    createNote: async (parent, { databaseId }, context) => {
      assertAuthenticated(context);
      await verifyDatabaseBelongsToUser(context, databaseId);

      const databaseDocument = await Database.findOne({ _id: databaseId });

      const newNote = await new Note({
        // TODO: Double check defaults
        userId: context.getUser()._id,
        databaseId: databaseId,
        title: 'untitled',
        blocks: []
      }).save();

      databaseDocument.notes.push(newNote._id);
      await databaseDocument.save();

      // TODO: Check whether to return a boolean instead
      return newNote;
    },
    deleteNote: async (parent, { noteId }, context) => {
      assertAuthenticated(context);
      await verifyNoteBelongsToUser(context, noteId);

      const noteDocument = await Note.findOne({ _id: noteId });
      const databaseId = noteDocument.databaseId;

      await Note.findOneAndRemove(
        { _id: noteId },
        {
          useFindAndModify: false
        }
      );

      const databaseDocument = await Database.findOne({ _id: databaseId });
      arrayRemoveItem(databaseDocument.notes, noteId);
      await databaseDocument.save();

      return noteDocument;
    },
    updateNoteTitle: async (parent, { noteId, title }, context) => {
      assertAuthenticated(context);
      await verifyNoteBelongsToUser(context, noteId);

      // TODO: Check deprecation warning
      return await Note.findOneAndUpdate(
        { _id: noteId },
        { title: title, latestUpdate: Date.now() },
        {
          new: true,
          useFindAndModify: false
        }
      );
    },
    updateNoteBlocks: async (parent, { noteId, input }, context) => {
      assertAuthenticated(context);
      await verifyNoteBelongsToUser(context, noteId);

      // TODO: Check deprecation warning
      return await Note.findOneAndUpdate(
        { _id: noteId },
        { ...input, latestUpdate: Date.now() },
        {
          new: true,
          useFindAndModify: false
        }
      );
    }
    // TODO: updateNoteDatabaseId (when shifting notes between databases)
  }
};

/**
 * Checks whether the user is logged in. Throws an AuthenticationError
 * otherwise.
 */
const assertAuthenticated = context => {
  if (!context.getUser()) {
    throw new AuthenticationError('You need to be logged in');
  }
};

/**
 * Verifies that the specified database exists, and belongs to the
 * current logged in user. Requires await.
 */
const verifyDatabaseBelongsToUser = async (context, databaseId) => {
  const databaseDocument = await Database.findOne({ _id: databaseId });
  if (!databaseDocument) {
    throw new UserInputError('This database does not exist!');
  }

  if (!context.getUser().databases.includes(databaseId)) {
    throw new ForbiddenError('This database does not belong to you!');
  }
};

/**
 * Verifies that the specified note exists, and belongs to the
 * current logged in user. Requires await.
 */
const verifyNoteBelongsToUser = async (context, noteId) => {
  const noteDocument = await Note.findOne({ _id: noteId });
  if (!noteDocument) {
    throw new UserInputError('Note does not exist!');
  }

  if (noteDocument.userId.toString() !== context.getUser()._id.toString()) {
    throw new ForbiddenError('This note does not belong to you!');
  }
};

/**
 * In-place removal of the specified item from the given array
 * if it exists.
 */
const arrayRemoveItem = (arr, value) => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
};

export default resolvers;
