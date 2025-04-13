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
  deleteTask,
  deleteTaskSuccess,
  updateTaskSuccess,
} from '../actions/todo.actions';
import { Task, TodoList } from './../../features/todo/models/todo.model';

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
  on(loadTodoListsSuccess, (state, { todoLists }) => {
    console.log('loadTodoListsSuccess',state, todoLists)
   return  {
    ...state,
    todoLists: todoLists.map(list => ({
      ...list,
      tasks: list.tasks ?? [],
    })),
    loading: false,
    error: null,
    }
  }),




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

  on(deleteTask, (state, { taskId }) => {
    if (!state.selectedList) return state;
    const updatedTasks = state.selectedList.tasks.filter((task) =>  (String(task._id) !== String(taskId)));
    return {
      ...state,
      selectedList: {
        ...state.selectedList,
        completedTasks: updatedTasks.filter((t) => t.completed).length,
        tasks: updatedTasks,
      },
    };
  }),

  on(deleteTaskSuccess, (state, { taskId }) => {
    if (!state.selectedList) {
      return state;
    }

    const updatedTasks = state.selectedList.tasks.filter((task) =>  (String(task._id) !== String(taskId)));
    const completedTasksCount = updatedTasks.filter((task) => task.completed).length;

    return {
      ...state,
      selectedList: {
        ...state.selectedList,
        completedTasks: completedTasksCount,
        tasks: updatedTasks,
        totalTasks: updatedTasks.length,
      },
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


  // on(updateTaskSuccess, (state, { updatedTask }) => {
  //   if (!state.selectedList) return state;

  //   const updateTasks = (tasks: Task[]) =>
  //     tasks.map(task => task._id === updatedTask._id ? { ...task, ...updatedTask } : task);

  //   const updatedSelectedList = {
  //     ...state.selectedList,
  //     tasks: updateTasks(state.selectedList.tasks),
  //     completedTasks: updateTasks(state.selectedList.tasks).filter(t => t.completed).length,
  //   };

  //   return {
  //     ...state,
  //     selectedList: updatedSelectedList,
  //     todoLists: state.todoLists.map(list =>
  //       list._id === updatedSelectedList._id
  //         ? { ...list, ...updatedSelectedList }
  //         : list
  //     )
  //   };
  // }),

  on(updateTaskSuccess, (state, { updatedTask }) => {
    const updateTaskInList = (list: TodoList) => ({
      ...list,
      tasks: list.tasks.map(task =>
        task._id === updatedTask._id ? { ...task, ...updatedTask } : task
      ),
      completedTasks: list.tasks.reduce(
        (count, t) => count + (t._id === updatedTask._id ? +updatedTask.completed : +t.completed),
        0
      ),
    });

    return {
      ...state,
      todoLists: state.todoLists.map(list => {
        console.log('list', list)
        return updateTaskInList(list)
      }),
      selectedList: state.selectedList ? updateTaskInList(state.selectedList) : null,
    };
  }),




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
