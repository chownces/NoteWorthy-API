import mongoose from 'mongoose';

const { Schema } = mongoose;

const SharedLinkSchema = new Schema({
  noteId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
});

const SharedLink = mongoose.model('SharedLink', SharedLinkSchema);

export default SharedLink;
