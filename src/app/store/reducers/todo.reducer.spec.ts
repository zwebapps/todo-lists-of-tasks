import { TodoList } from "../../features/todo/models/todo.model";
import { addTodoList, updateTask } from "../actions/todo.actions";
import { todoReducer } from "./todo.reducer";

describe('todoReducer', () => {
  it('should add a todo list', () => {
    const state: TodoList[] | undefined = [];
    const action = addTodoList({ title: 'Test List' });
    const result = todoReducer(state, action);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Test List');
  });

  it('should update a task', () => {
    const state = [{ id: 'list1', title: 'List', tasks: [{ id: 'task1', title: 'Old', completed: false }] }];
    const action = updateTask({ listId: 'list1', taskId: 'task1', title: 'Updated', description: 'New Desc' });
    const result = todoReducer(state, action);
    expect(result[0].tasks[0].title).toBe('Updated');
    expect(result[0].tasks[0].description).toBe('New Desc');
  });
});
