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

  type Database {
    id: ID!
    title: String!
    currentView: String!
    notes: [String]!
  }

  type Note {
    id: ID!
    userId: ID!
    databaseId: ID!
    title: String!
    blocks: [NoteBlock]!
    creationDate: Date!
    latestUpdate: Date!
  }

  type NoteBlock {
    id: String!
    html: String!
    tag: String!
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
    getNote(noteId: ID!): Note
    getAllNotesInDatabase(databaseId: ID!): [Note]
    getAllUserDatabases: [Database]
    currentUser: User
  }

  type Mutation {
    register(input: RegisterInput): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    createDatabase: Database
    updateDatabaseTitle(databaseId: ID!, title: String!): Database
    createNote(databaseId: ID!): Note
    updateNoteTitle(noteId: ID!, title: String!): Note
    updateNoteBlocks(noteId: ID!, input: UpdateNoteBlocksInput): Note
  }
`;

// TODO: See resolvers.js for a list of unimplemented queries and mutations

export default typeDefs;
