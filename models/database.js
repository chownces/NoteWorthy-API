import mongoose from 'mongoose';

const { Schema } = mongoose;

// To replace with Typescript in the future
export const DatabaseViews = Object.freeze({
  BOARD: 'board',
  TABLE: 'table'
});

const DatabaseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  currentView: {
    type: String,
    required: true
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

const Database = mongoose.model('Database', DatabaseSchema);

export default Database;
