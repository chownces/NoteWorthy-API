import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  blocks: {
    type: [NoteBlockSchema],
    required: true
  },
  // blocks: {
  //   type: Schema.Types.String,
  //   ref: 'Noteblock'
  // },
  creationDate: {
    type: Date,
    default: new Date(Date.now())
  },
  latestUpdate: {
    type: Date,
    required: true
  }
});

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

const Note = mongoose.model('Note', NoteSchema);

export default Note;
