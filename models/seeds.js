/**
 * Seeds the development MongoDB database.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './category';
import Database, { DatabaseViews } from './database';
import Note from './note';
import User from './user';

dotenv.config();
const { MONGODB_URI } = process.env;

const main = async () => {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(conn => mongoose.connection.db.dropDatabase());

  const database = await Database.create({
    title: 'My first database',
    currentView: DatabaseViews.BOARD,
    categories: [],
    notes: []
  });

  const user = new User({
    firstname: 'Bob',
    lastname: 'Tan',
    email: 'bob@gmail.com',
    password: '12345',
    databases: [database._id]
  });
  await user.hashPassword();
  await user.save();

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

  const notes = await Note.create([
    {
      userId: user._id,
      databaseId: database._id,
      categoryId: categories[1]._id,
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
      ]
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
      ]
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
      ]
    }
  ]);

  categories[1].notes.push(notes[0]._id, notes[1]._id);
  categories[2].notes.push(notes[2]._id);

  database.categories.push(...categories.map(e => e._id));
  database.notes.push(...notes.map(e => e._id));

  Promise.all([categories[1].save(), categories[2].save(), database.save()]).then(() =>
    mongoose.connection.close()
  );
};

main();
