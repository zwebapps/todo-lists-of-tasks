import { createReducer, on } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addTodoList, addTask, toggleTaskStatus, loadTodoListsSuccess, updateTask } from '../actions/todo.actions';
import { TodoList } from './../../features/todo/models/todo.model';

export const initialState: TodoList[] = [];

// export const todoReducer = createReducer(
//   initialState,
//   on(loadTodoListsSuccess, (_, { todoLists }) => [...todoLists]),

//   on(addTodoList, (state, { title }) => [...state, { id: uuidv4(), title, tasks: [] }]),
//   on(addTask, (state, { listId, task }) => state.map(list =>
//     list.id === listId ? {
//       ...list,
//       tasks: [...list.tasks, { ...task, id: uuidv4(), completed: false }]
//     } : list)),
//   on(toggleTaskStatus, (state, { listId, taskId }) => state.map(list =>
//     list.id === listId ? {
//       ...list,
//       tasks: list.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
//     } : list)),
//   on(updateTask, (state, { listId, taskId, title, description }) => state.map(list =>
//     list.id === listId ? {
//       ...list,
//       tasks: list.tasks.map(task => task.id === taskId ? { ...task, title, description } : task)
//     } : list))
// );


export const todoReducer = createReducer(
  initialState,
  on(loadTodoListsSuccess, (_, { todoLists }) => [...todoLists]),

  on(addTodoList, (state, { title }) => [...state, { id: uuidv4(), title, tasks: [] }]),
  on(addTask, (state, { listId, task }) => state.map(list =>
    list.id === listId ? {
      ...list,
      tasks: [...list.tasks, { ...task, id: uuidv4(), completed: false }]
    } : list)),
  on(toggleTaskStatus, (state, { listId, taskId }) => state.map(list =>
    list.id === listId ? {
      ...list,
      tasks: list.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
    } : list)),
  on(updateTask, (state, { listId, taskId, title, description }) => state.map(list =>
    list.id === listId ? {
      ...list,
      tasks: list.tasks.map(task => task.id === taskId ? { ...task, title, description } : task)
    } : list))
);
