/**
 * This is the typeDefs file for the GraphQL endpoint.
 *
 * To add a new resolver, add it to typeDefs below, and define it
 * in `resolvers.js`.
 * To update MongoDB schema, update the /models directory.
 */

import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    firstname: String!
    lastname: String!
    email: String!
  }

  type Category {
    id: ID!
    name: String!
    notes: [ID]!
    databaseId: ID!
  }

  type Database {
    id: ID!
    title: String!
    currentView: String!
    categories: [ID]!
    notes: [String]!
  }

  type PopulatedDatabase {
    id: ID!
    title: String!
    currentView: String!
    categories: [Category]!
    notes: [Note]!
  }

  type Note {
    id: ID!
    userId: ID!
    databaseId: ID!
    categoryId: ID!
    title: String!
    blocks: [NoteBlock]!
    creationDate: Date!
    latestUpdate: Date!
  }

  type FlatNote {
    id: ID!
    userId: ID!
    databaseId: ID!
    categoryId: ID!
    title: String!
    blocks: [FlatBlock]!
    creationDate: Date!
    latestUpdate: Date!
  }

  type NoteBlock {
    id: String!
    html: String!
    tag: String!
    children: [NoteBlock]!
  }

  type FlatBlock {
    id: String!
    html: String!
    tag: String!
    children: [String]
    parent: String
  }

  type AuthPayload {
    user: User!
  }

  input RegisterInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
  }

  input NoteBlockInput {
    id: String!
    html: String!
    tag: String!
  }

  input UpdateNoteBlocksInput {
    blocks: [NoteBlockInput]
  }

  scalar Date

  type Query {
    getNote(noteId: ID!): FlatNote
    getDatabase(databaseId: ID!): PopulatedDatabase
    getAllUserDatabases: [Database]
    currentUser: User
  }

  type Mutation {
    register(input: RegisterInput): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    createDatabase: Database
    deleteDatabase(databaseId: ID!): Database
    createDatabaseCategory(databaseId: ID!, categoryName: String!, index: Int!): Database
    deleteDatabaseCategory(databaseId: ID!, categoryId: ID!): Database
    updateDatabaseTitle(databaseId: ID!, title: String!): Database
    updateDatabaseView(databaseId: ID!, view: String!): Database
    updateDatabaseNotes(databaseId: ID!, notes: [ID]!): Database
    createNote(databaseId: ID!, categoryId: ID!, title: String!, index: Int!): Note
    deleteNote(noteId: ID!): Note
    updateNoteTitle(noteId: ID!, title: String!): Note
    updateNoteCategory(noteId: ID!, categoryId: ID!, index: Int!): Database
    updateNoteBlocks(noteId: ID!, input: UpdateNoteBlocksInput): Note
  }
`;

// TODO: Add an enum for Database currentView
// TODO: See resolvers.js for a list of unimplemented queries and mutations

export default typeDefs;
