import mongoose from "mongoose";

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
  },
  {
    timestamps: true
  }
)

export const Todo = mongoose.model('Todo', todoSchema);
