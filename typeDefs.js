/**
 * This is the typeDefs file for the GraphQL endpoint.
 *
 * To add a new resolver, add it to typeDefs below, and define it
 * in `resolvers.js`.
 * To update MongoDB schema, update the /models directory.
 */

import { gql } from 'apollo-server-express';

// TODO: Only the authflow queries and mutations are working

const typeDefs = gql`
  type User {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    databases: [Database]
  }

  type Database {
    id: ID!
    title: String!
    currentView: String!
    notes: [Note]
  }

  type Note {
    id: ID!
    title: String!
    blocks: [NoteBlock]!
    creationDate: Date
    latestUpdate: Date
  }

  type NoteBlock {
    id: String!
    html: String!
    tag: String!
  }

  type AuthPayload {
    user: User
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

  input CreateNoteInput {
    title: String!
    blocks: [NoteBlockInput]!
  }

  input UpdateNoteTitleInput {
    title: String
  }

  input UpdateNoteBlocksInput {
    blocks: [NoteBlockInput]
  }

  scalar Date

  type Query {
    getNote(id: ID!): Note
    allNotes: [Note]
    allDatabases: [Database]
    allUsers: [User]
    currentUser: User
  }

  type Mutation {
    createNote(input: CreateNoteInput): Note
    updateNoteTitle(id: ID!, input: UpdateNoteTitleInput): Note
    updateNoteBlocks(id: ID!, input: UpdateNoteBlocksInput): Note
    deleteNote(id: ID!): Note
    deleteAllUsers: Boolean

    register(input: RegisterInput): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

/**
 * TODO: Create mutations that update fields individually.
 */

export default typeDefs;
