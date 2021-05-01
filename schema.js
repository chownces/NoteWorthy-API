/**
 * This is the schema file for the GraphQL endpoint.
 *
 * To add a new resolver, add it to typeDefs below, and define it
 * in `resolvers.js`.
 * To update MongoDB schema, update /models directory.
 */
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
  type NoteBlock {
    id: String!
    html: String!
    tag: String!
  }

  type Note {
    _id: ID!
    title: String!
    date: Date
    blocks: [NoteBlock]!
  }

  input NoteBlockInput {
    id: String!
    html: String!
    tag: String!
  }

  input NoteInput {
    title: String!
    blocks: [NoteBlockInput]!
  }

  input NoteUpdateInput {
    title: String
    blocks: [NoteBlockInput]
  }

  scalar Date

  type Query {
    getNote(_id: ID!): Note
    allNotes: [Note]
  }

  type Mutation {
    createNote(input: NoteInput): Note
    updateNote(_id: ID!, input: NoteUpdateInput): Note
    deleteNote(_id: ID!): Note
  }
`;
/**
 * TODO: Unused defs currently:
 * Note:: title, date
 * NoteInput:: title
 * NoteUpdateInput:: title
 */

/**
 * TODO: Create mutations that update fields individually.
 */

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
