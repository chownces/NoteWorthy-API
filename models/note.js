import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // TODO: Change this to `blocks` array
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
  // TODO: Track latest update to note
})

export default mongoose.model('note', NoteSchema);