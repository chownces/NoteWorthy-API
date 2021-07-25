import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoteBlockSchema = new Schema({
  id: {
    /**
     * We are using the unique id string that is generated from the frontend
     * as we do not save the changes to the backend on every keydown.
     */
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  }
});

const NoteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    databaseId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    blocks: {
      type: [NoteBlockSchema],
      required: true
    },
    creationDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    latestUpdate: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { toObject: { virtuals: true } }
);

NoteSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

const Note = mongoose.model('Note', NoteSchema);

export default Note;
