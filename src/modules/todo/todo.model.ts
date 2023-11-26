import mongoose from 'mongoose';
import { ITodo } from './todo.interfaces.ts';

const todoSchema = new mongoose.Schema<ITodo>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Todo must have a name'],
    trim: true,
    maxlength: [20, 'Todo title must have less or equal 20 characters'],
    minlength: [4, 'Todo title must have more or equal 4 characters'],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

export const Todo = mongoose.model<ITodo>('Todo', todoSchema);
