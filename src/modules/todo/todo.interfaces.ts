import * as mongoose from 'mongoose';
export interface ITodo {
  title: string;
  description?: string;
  image?: string;
  status: TodoStatus;
  userId: mongoose.Types.ObjectId;
}

export enum TodoStatus {
  Todo = 'todo',
  InProgress = 'inprogress',
  Done = 'done',
}
