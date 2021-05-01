import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NoteBlockSchema = new Schema({
  id: {
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
})

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  blocks: {
    type: [NoteBlockSchema],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
  // TODO: Track latest update to note
})

export default mongoose.model('note', NoteSchema);