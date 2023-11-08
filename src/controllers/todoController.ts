import { Request, Response } from 'express';
import { Todo } from '../models/todo.ts';
import { catchAsync } from '../utils/catchAsync.ts';

const getAllTodos = catchAsync(async (req: Request, res: Response) => {
  const todos = await Todo.find();

  res.status(200).json({
    status: 'success',
    data: {
      todos,
    },
  });
});

const createTodo = catchAsync(async (req: Request, res: Response) => {
  const todo = await Todo.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { todo },
  });
});

const getTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);

  res.status(200).json({
    status: 'success',
    data: {
      todo,
    },
  });
});

const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const updateTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const todo = await Todo.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { todo },
  });
});

export const todoController = {
  getAllTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
};
