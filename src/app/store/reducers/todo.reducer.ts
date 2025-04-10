import { createReducer, on } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { addTodoList, addTask, toggleTaskStatus, loadTodoListsSuccess, updateTask, setSelectedTodoList, loadTodoListsFailure } from '../actions/todo.actions';
import { TodoList, TodoState } from './../../features/todo/models/todo.model';

export const initialState: TodoState = {
  todoLists: [],
  selectedList: null,
  loading: false,
  error: null,
};


// In your component, when a list is selected:
// this.store.dispatch(setSelectedTodoList({ selectedList: selectedTodoList }));

// import { createReducer, on } from '@ngrx/store';
// import { v4 as uuidv4 } from 'uuid'; // Ensure you have uuid installed
// import { TodoState, TodoList, Task } from './todo.models';
// import {
//   loadTodoListsSuccess,
//   loadTodoListsFailure,
//   addTodoList,
//   addTask,
//   toggleTaskStatus,
//   updateTask,
//   setSelectedTodoList
// } from './todo.actions';

// export const initialState: TodoState = {
//   todoLists: [],
//   selectedList: null,
//   loading: false,
//   error: null,
// };

export const todoReducer = createReducer(
  initialState,
  // Load Todo Lists success
  on(loadTodoListsSuccess, (state, { todoLists }) => ({
    ...state,
    todoLists,
    loading: false,
    error: null
  })),

  // Load Todo Lists failure
  on(loadTodoListsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add a new Todo List
  on(addTodoList, (state, { title }) => ({
    ...state,
    todoLists: [
      ...state.todoLists,
      { id: uuidv4(), title, tasks: [] }
    ]
  })),

  // Add a new task to a Todo List
  on(addTask, (state, { listId, task }) => ({
    ...state,
    todoLists: state.todoLists.map(list =>
      list.id === listId ? {
        ...list,
        tasks: [...list.tasks, { ...task, id: uuidv4(), completed: false }]
      } : list
    )
  })),

  // Toggle task completion status
  on(toggleTaskStatus, (state, { listId, taskId }) => ({
    ...state,
    todoLists: state.todoLists.map(list =>
      list.id === listId ? {
        ...list,
        tasks: list.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      } : list
    )
  })),

  // Update task details (title, description)
  on(updateTask, (state, { listId, taskId, title, description }) => ({
    ...state,
    todoLists: state.todoLists.map(list =>
      list.id === listId ? {
        ...list,
        tasks: list.tasks.map(task =>
          task.id === taskId ? { ...task, title, description } : task
        )
      } : list
    )
  })),

  // Set the selected todo list
  on(setSelectedTodoList, (state, { selectedList }) => ({
    ...state,
    selectedList
  }))
);
