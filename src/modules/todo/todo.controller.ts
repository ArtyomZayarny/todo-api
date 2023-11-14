import { Request, Response } from 'express';
import { Todo } from './todo.model.ts';
import { catchAsync } from '../../utils/catchAsync.ts';

export const getAllTodos = catchAsync(async (req: Request, res: Response) => {
  const todos = await Todo.find();

  res.status(200).json({
    data: {
      todos,
    },
  });
});

export const createTodo = catchAsync(async (req: Request, res: Response) => {
  const todo = await Todo.create(req.body);

  res.status(201).json({
    data: { todo },
  });
});

export const getTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);

  res.status(200).json({
    data: {
      todo,
    },
  });
});

export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);

  res.status(204).json({
    data: null,
  });
});

export const updateTodo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const todo = await Todo.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    data: { todo },
  });
});
