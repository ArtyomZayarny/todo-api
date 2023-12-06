export interface ITodo {
  title: string;
  description?: string;
  image?: string;
  status: TodoStatus;
}

export enum TodoStatus {
  Todo = 'todo',
  InProgress = 'inprogress',
  Done = 'done',
}
