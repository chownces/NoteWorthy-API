import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  // TODO: Consider adding namespacing for different authentication providers
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  databases: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Database'
    }
  ],
  lastVisited: {
    type: Schema.Types.ObjectId,
    required: 'true'
  }
});

UserSchema.methods = {
  hashPassword: async function () {
    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    } catch (error) {
      // TODO: Remove this console.error
      console.error(error);
    }
  }
};

const User = mongoose.model('User', UserSchema);

export default User;
