const getAllTodos = () => {
  console.log('Get All todos');
};
const getTodo = (id: string) => {
  console.log(`Get todo with id: ${id}`);
};
const createTodo = (todo: any) => {
  console.log('Create new todo');
};
const deleteTodo = (id: string) => {
  console.log('Delete todo');
};
const updateTodo = (id: string) => {
  console.log('Update todo');
};

export const todoController = {
  getAllTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
};
