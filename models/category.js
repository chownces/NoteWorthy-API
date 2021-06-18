import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
  databaseId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
