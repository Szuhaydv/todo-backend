import mongoose from 'mongoose'

const todoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: false
    },
    author: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    todos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo'
    }
});

export const Todo = mongoose.model('Todo', todoSchema);

export const User = mongoose.model('User', UserSchema);