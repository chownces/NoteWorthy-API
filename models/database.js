import mongoose from 'mongoose';

const { Schema } = mongoose;

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
