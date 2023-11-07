import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo must have a name'],
    trim: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

export const Todo = mongoose.model('Todo', todoSchema);
