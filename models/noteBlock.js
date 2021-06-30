import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoteBlockSchema = new Schema({
  _id: {
    /**
     * We are using the unique id string that is generated from the frontend
     * as we do not save the changes to the backend on every keydown.
     * We self-assign this mongodb id to allow population
     */
    type: String,
    required: true
  },
  html: {
    type: String,
    required: false
  },
  tag: {
    type: String,
    default: 'p',
    required: true
  }
});

const NoteBlock = mongoose.model('NoteBlock', NoteBlockSchema);

export default NoteBlock;
