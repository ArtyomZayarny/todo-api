import { injectable } from 'inversify';
import { Todo } from './todo.model.ts';
import { ITodo } from './todo.interfaces.ts';

@injectable()
export class TodoService {
  constructor() {}

  public async find() {
    return await Todo.find();
  }

  public async create(payload: ITodo) {
    return await Todo.create(payload);
  }

  public async getOne(id: string) {
    return await Todo.findById(id);
  }

  public async delete(id: string) {
    return await Todo.findByIdAndDelete(id);
  }

  public async update(id: string, payload: ITodo) {
    return await Todo.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }
}
