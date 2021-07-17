import { ApolloServer } from 'apollo-server-express';

import dbHandler from './dbHandler';
import typeDefs from '../typeDefs';
import resolvers from '../resolvers';
import { afterAll, beforeEach, expect, jest } from '@jest/globals';
import Note from '../models/note';
import Database, { DatabaseViews } from '../models/database';
import User from '../models/user';
import Category from '../models/category';

const mockContext = () => ({
  getUser: () => mockUser
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: mockContext
});

beforeAll(async () => await dbHandler.connect());
beforeEach(async () => await seed());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('getNote resolver', () => {
  const GET_NOTE_QUERY = `
  query getNote($id: ID!) {
    getNote(noteId: $id) {
      id
      userId
      databaseId
      categoryId
      title
      blocks {
        id
        html
        tag
      }
      creationDate
      latestUpdate
    }
  }
`;

  test('retrieves note correctly', async () => {
    const res = await server.executeOperation({
      query: GET_NOTE_QUERY,
      variables: { id: noteIds[0].toString() }
    });

    mongooseDocJsArray(res.data.getNote);

    expect(res.data.getNote).toEqual({
      id: noteIds[0].toString(),
      userId: mockUser._id.toString(),
      databaseId: databaseIds[0].toString(),
      categoryId: categoryIds[0].toString(),
      title: 'Note 1',
      blocks: [
        {
          id: 'kq7pxktge3ei2ap85pt',
          html: 'Hello World!',
          tag: 'p'
        },
        {
          id: 'kq7pyhx0mopasjm22y',
          html: 'Nice to meet you!',
          tag: 'p'
        }
      ],
      creationDate: new Date('2021-07-17T11:10:01.569Z'),
      latestUpdate: new Date('2021-07-17T11:10:01.569Z')
    });
  });

  test('fails when note does not exist', async () => {
    const res = await server.executeOperation({
      query: GET_NOTE_QUERY,
      variables: { id: '507f1f77bcf86cd799439011' }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toEqual('Note does not exist!');
  });

  test('fails when note does not belong to user', async () => {
    const res = await server.executeOperation({
      query: GET_NOTE_QUERY,
      variables: { id: noteIds[3].toString() }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toEqual('This note does not belong to you!');
  });
});

describe('getDatabase resolver', () => {
  const GET_DATABASE_QUERY = `
  query getDatabase($id: ID!) {
    getDatabase(databaseId: $id) {
      id
      title
      currentView
      categories {
        id
        notes
        name
        databaseId
      }
      notes {
        id
        userId
        databaseId
        categoryId
        title
        blocks {
          id
          html
          tag
        }
        creationDate
        latestUpdate
      }
    }
  }
`;

  test('retrieves database correctly', async () => {
    const res = await server.executeOperation({
      query: GET_DATABASE_QUERY,
      variables: { id: databaseIds[0].toString() }
    });

    mongooseDocJsArray(res.data.getDatabase);

    expect(res.data.getDatabase).toEqual({
      id: databaseIds[0].toString(),
      title: 'My first database',
      currentView: DatabaseViews.BOARD,
      categories: [
        {
          id: categoryIds[0].toString(),
          notes: [noteIds[0].toString()],
          name: 'Non-categorised',
          databaseId: databaseIds[0].toString()
        },
        {
          id: categoryIds[1].toString(),
          notes: [noteIds[1].toString()],
          name: 'Todos',
          databaseId: databaseIds[0].toString()
        },
        {
          id: categoryIds[2].toString(),
          notes: [noteIds[2].toString()],
          name: 'Completed',
          databaseId: databaseIds[0].toString()
        }
      ],
      notes: [
        {
          id: noteIds[0].toString(),
          userId: mockUser._id.toString(),
          databaseId: databaseIds[0].toString(),
          categoryId: categoryIds[0].toString(),
          title: 'Note 1',
          blocks: [
            {
              id: 'kq7pxktge3ei2ap85pt',
              html: 'Hello World!',
              tag: 'p'
            },
            {
              id: 'kq7pyhx0mopasjm22y',
              html: 'Nice to meet you!',
              tag: 'p'
            }
          ],
          creationDate: new Date('2021-07-17T11:10:01.569Z'),
          latestUpdate: new Date('2021-07-17T11:10:01.569Z')
        },
        {
          id: noteIds[1].toString(),
          userId: mockUser._id.toString(),
          databaseId: databaseIds[0].toString(),
          categoryId: categoryIds[1].toString(),
          title: 'Note 2',
          blocks: [
            {
              id: 'kq7q9o5bt8m0n22o7b',
              html: 'Todos:',
              tag: 'p'
            },
            {
              id: 'kq7q9svlmdm1rwwzot',
              html: 'Orbital!',
              tag: 'p'
            }
          ],
          creationDate: new Date('2021-07-17T11:10:01.569Z'),
          latestUpdate: new Date('2021-07-17T11:10:01.569Z')
        },
        {
          id: noteIds[2].toString(),
          userId: mockUser._id.toString(),
          databaseId: databaseIds[0].toString(),
          categoryId: categoryIds[2].toString(),
          title: 'Note 3',
          blocks: [
            {
              id: 'kq7q9xy3mvo4dd8qm5o',
              html: 'Completed these:',
              tag: 'p'
            },
            {
              id: 'kq7qa1bw3btb62qbxav',
              html: 'Coding!',
              tag: 'p'
            }
          ],
          creationDate: new Date('2021-07-17T11:10:01.569Z'),
          latestUpdate: new Date('2021-07-17T11:10:01.569Z')
        }
      ]
    });
  });

  test('fails when database does not exist', async () => {
    const res = await server.executeOperation({
      query: GET_DATABASE_QUERY,
      variables: { id: '507f1f77bcf86cd799439011' }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toEqual('This database does not exist!');
  });

  test('fails when database does not belong to user', async () => {
    const res = await server.executeOperation({
      query: GET_DATABASE_QUERY,
      variables: { id: databaseIds[1].toString() }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toEqual('This database does not belong to you!');
  });
});

describe('getAllUserDatabases resolver', () => {
  const GET_ALL_USER_DATABASES_QUERY = `
  {
    getAllUserDatabases {
      id
      title
      currentView
      notes
    }
  }
`;

  test('retrieves all databases correctly', async () => {
    const res = await server.executeOperation({
      query: GET_ALL_USER_DATABASES_QUERY
    });

    expect(res.data.getAllUserDatabases).toEqual([
      {
        id: databaseIds[0].toString(),
        currentView: DatabaseViews.BOARD,
        // fourth note does not belong to this database
        notes: noteIds.map(e => e.toString()).filter((e, idx) => idx !== 3),
        title: 'My first database'
      }
    ]);
  });
});

describe('currentUser resolver', () => {
  const GET_CURRENT_USER_QUERY = `
  {
    currentUser {
      firstname
      lastname
      email
    }
  }
  `;

  test('retrieves current user successfully', async () => {
    const res = await server.executeOperation({
      query: GET_CURRENT_USER_QUERY
    });

    expect(res.data.currentUser).toEqual({
      firstname: mockUser.firstname,
      lastname: mockUser.lastname,
      email: mockUser.email
    });
  });
});

// ======================= Seed test database =======================
let mockUser;
let databaseIds;
let noteIds;
let categoryIds;

const seed = async () => {
  const user = new User({
    firstname: 'Bob',
    lastname: 'Tan',
    email: 'bob@gmail.com',
    password: '12345',
    databases: []
  });
  await user.hashPassword();
  await user.save();

  mockUser = user;

  const database = await Database.create({
    title: 'My first database',
    currentView: DatabaseViews.BOARD,
    categories: [],
    notes: []
  });

  const databaseNotBelong = await Database.create({
    title: 'Does not belong to mock user',
    currentView: DatabaseViews.TABLE,
    categories: [],
    notes: []
  });

  databaseIds = [database._id, databaseNotBelong._id];

  const categories = await Category.create([
    {
      name: 'Non-categorised',
      notes: [],
      databaseId: database._id
    },
    {
      name: 'Todos',
      notes: [],
      databaseId: database._id
    },
    {
      name: 'Completed',
      notes: [],
      databaseId: database._id
    }
  ]);

  categoryIds = categories.map(e => e._id);

  const notes = await Note.create([
    {
      userId: user._id,
      databaseId: database._id,
      categoryId: categories[0]._id,
      title: 'Note 1',
      blocks: [
        {
          id: 'kq7pxktge3ei2ap85pt',
          html: 'Hello World!',
          tag: 'p'
        },
        {
          id: 'kq7pyhx0mopasjm22y',
          html: 'Nice to meet you!',
          tag: 'p'
        }
      ],
      creationDate: new Date('2021-07-17T11:10:01.569Z'),
      latestUpdate: new Date('2021-07-17T11:10:01.569Z')
    },
    {
      userId: user._id,
      databaseId: database._id,
      categoryId: categories[1]._id,
      title: 'Note 2',
      blocks: [
        {
          id: 'kq7q9o5bt8m0n22o7b',
          html: 'Todos:',
          tag: 'p'
        },
        {
          id: 'kq7q9svlmdm1rwwzot',
          html: 'Orbital!',
          tag: 'p'
        }
      ],
      creationDate: new Date('2021-07-17T11:10:01.569Z'),
      latestUpdate: new Date('2021-07-17T11:10:01.569Z')
    },
    {
      userId: user._id,
      databaseId: database._id,
      categoryId: categories[2]._id,
      title: 'Note 3',
      blocks: [
        {
          id: 'kq7q9xy3mvo4dd8qm5o',
          html: 'Completed these:',
          tag: 'p'
        },
        {
          id: 'kq7qa1bw3btb62qbxav',
          html: 'Coding!',
          tag: 'p'
        }
      ],
      creationDate: new Date('2021-07-17T11:10:01.569Z'),
      latestUpdate: new Date('2021-07-17T11:10:01.569Z')
    }
  ]);

  // fourth note does not belong to mock user nor his database
  const notesNotBelong = await Note.create([
    {
      userId: '507f1f77bcf86cd799439011',
      databaseId: '507f1f77bcf86cd799439011',
      categoryId: '507f1f77bcf86cd799439011',
      title: 'Note 4',
      blocks: [
        {
          id: 'kq7q9xy3mvo4dd8qm5p',
          html: 'I do not belong to the mock user',
          tag: 'p'
        }
      ],
      creationDate: new Date('2021-07-17T11:10:01.569Z'),
      latestUpdate: new Date('2021-07-17T11:10:01.569Z')
    }
  ]);

  noteIds = notes.map(e => e._id);
  noteIds.push(notesNotBelong[0]._id);

  categories[0].notes.push(notes[0]._id);
  categories[1].notes.push(notes[1]._id);
  categories[2].notes.push(notes[2]._id);

  database.categories.push(...categories.map(e => e._id));
  database.notes.push(...notes.map(e => e._id));

  user.databases.push(database._id);

  await Promise.all([
    categories[0].save(),
    categories[1].save(),
    categories[2].save(),
    database.save(),
    user.save()
  ]);
};

/**
 * Converts all mongoose arrays within the document into a JavaScript array
 * for Jest equality checks.
 */
const mongooseDocJsArray = mongooseDoc => {
  const keys = Object.keys(mongooseDoc);
  for (const i of keys) {
    if (Array.isArray(mongooseDoc[i])) {
      mongooseDoc[i] = [...mongooseDoc[i]];
      mongooseDoc[i].forEach(e => mongooseDocJsArray(e));
    }
  }
};
