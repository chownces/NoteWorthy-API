import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoteBlockSchema = new Schema({
  _id: {
    /**
     * We are using the unique id string that is generated from the frontend
     * as we do not save the changes to the backend on every keydown.
     */
    type: Schema.Types.ObjectId,
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

const NoteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
  blockIds: {
    type: [String],
    required: true
  },
  // blocks: {
  //   type: Schema.Types.String,
  //   ref: 'Noteblock'
  // },
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
});

NoteSchema.virtual('blocks', {
  ref: 'NoteBlock',
  localField: 'blockIds',
  foreignField: '_id',
  justOne: false
});

const Note = mongoose.model('Note', NoteSchema);

export default Note;
