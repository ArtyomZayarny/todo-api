import mongoose from 'mongoose';
import { ITodo, TodoStatus } from './todo.interfaces.ts';

const todoSchema = new mongoose.Schema<ITodo>({
  title: {
    type: String,
    trim: true,
    maxlength: [150, 'Todo title must have less or equal 20 characters'],
    minlength: [4, 'Todo title must have more or equal 4 characters'],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: [TodoStatus.Done, TodoStatus.InProgress, TodoStatus.Todo],
    default: TodoStatus.Todo,
  },
  userId: mongoose.Types.ObjectId,
});

export const Todo = mongoose.model<ITodo>('Todo', todoSchema);
