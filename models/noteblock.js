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

const NoteBlock = mongoose.model('Note', NoteBlockSchema);

export default NoteBlock;
