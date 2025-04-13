import { createReducer, on } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import {
  addTodoList,
  addTask,
  toggleTaskStatus,
  loadTodoListsSuccess,
  updateTask,
  setSelectedTodoList,
  loadTodoListsFailure,
  loadTasksSuccess,
  setSelectedTodoListById,
  clearSelectedList,
  toggleTaskCompletionSuccess,
} from '../actions/todo.actions';
import { TodoList } from './../../features/todo/models/todo.model';

export interface TodoState {
  todoLists: TodoList[];
  selectedList: TodoList | null;
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todoLists: [],
  selectedList: null,
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,
  // Load Todo Lists success
  on(loadTodoListsSuccess, (state, { todoLists }) => ({
    ...state,
    todoLists,
    loading: false,
    error: null,
  })),

  // Load Todo Lists failure
  on(loadTodoListsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add a new Todo List
  on(addTodoList, (state, { title }) => ({
    ...state,
    todoLists: [...state.todoLists, { _id: uuidv4(), title, tasks: [] }],
  })),

  // Add a new task to a Todo List
  on(addTask, (state, { listId, task }) => {
    if (!state.selectedList || state.selectedList._id !== listId) {
      return state;
    }
    // Update the selected list with the new task
    const updatedSelectedList = {
      ...state.selectedList,
      tasks: [
        ...state.selectedList.tasks,
        { ...task, _id: uuidv4(), completed: !task.completed },
      ],
    };
    return {
      ...state,
      selectedList: updatedSelectedList,
    };
  }),

  on(toggleTaskStatus, (state, { taskId }) => {
    if (!state.selectedList) return state;

    const updatedTasks = state.selectedList.tasks.map((task) => {
      if (String(task._id) === String(taskId)) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    return {
      ...state,
      selectedList: {
        ...state.selectedList,
        completedTasks: updatedTasks.filter((t) => t.completed).length,
        tasks: updatedTasks,
      },
    };
  }),

  // Update task details (title, description)
  on(updateTask, (state, { listId, taskId, title, description }) => ({
    ...state,
    todoLists: state.todoLists.map((list) =>
      list._id === listId
        ? {
            ...list,
            tasks: list.tasks.map((task) =>
              task._id === taskId ? { ...task, title, description } : task
            ),
          }
        : list
    ),
  })),

  // Set the selected todo list
  on(setSelectedTodoList, (state, { selectedList }) => ({
    ...state,
    selectedList,
  })),

  on(clearSelectedList, (state) => ({
    ...state,
    selectedList: null,
  })),

  on(setSelectedTodoListById, (state, { listId }) => {
    const selectedList =
      state.todoLists.find((list) => list._id === listId) ?? null;
    return {
      ...state,
      selectedList,
    };
  }),

  on(loadTasksSuccess, (state, { tasks }) => {
    const newSelectedList = {
      ...state.selectedList,
      tasks,
      _id: state.selectedList?._id ?? '',
      title: state.selectedList?.title ?? '',
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.completed).length,
    };
    return {
      ...state,
      selectedList: newSelectedList,
      loading: false,
    };
  }),

  on(toggleTaskCompletionSuccess, (state, { taskId, completed }) => {
    if (!state.selectedList) {
      return state;
    }

    const updatedTasks = state.selectedList?.tasks.map((task, index) =>
      task._id === taskId ? { ...task, completed } : task
    );
    const completedTasksCount = updatedTasks.filter(
      (task) => task.completed
    ).length;

    return {
      ...state,
      selectedList: {
        ...state.selectedList,
        completedTasks: completedTasksCount,
        tasks: updatedTasks,
      },
    };
  })
);
