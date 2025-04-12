
// import { TodoList, Task } from './../../features/todo/models/todo.model';
// import { createAction, props } from '@ngrx/store';

// // export const loadTodoLists = createAction('[Todo] Load Todo Lists');

// // export const loadTodoListsSuccess = createAction('[Todo] Load Todo Lists Success', props<{ lists: TodoList[] }>());
// // export const addTodoList = createAction('[Todo] Add Todo List', props<{ title: string }>());
// // export const addTask = createAction('[Todo] Add Task', props<{ listId: string; task: Omit<Task, 'id'> }>());


// export const toggleTaskStatus = createAction(
//   '[Todo] Toggle Task Status',
//   props<{ listId: string; taskId: string }>()
// );


// export const updateTask = createAction(
//   '[Todo] Update Task',
//   props<{ listId: string; taskId: string; title: string; description?: string }>()
// );



// // Load all Todo Lists
// export const loadTodoLists = createAction('[Todo] Load Todo Lists');

// // Successfully loaded Todo Lists
// export const loadTodoListsSuccess = createAction(
//   '[Todo] Load Todo Lists Success',
//   props<{ todoLists: TodoList[] }>()
// );

// // Failed to load Todo Lists
// export const loadTodoListsFailure = createAction(
//   '[Todo] Load Todo Lists Failure',
//   props<{ error: any }>()
// );

// // Add a new Todo List
// export const addTodoList = createAction(
//   '[Todo] Add Todo List',
//   props<{ title: string }>()
// );

// // Successfully added a Todo List
// export const addTodoListSuccess = createAction(
//   '[Todo] Add Todo List Success',
//   props<{ todoList: TodoList }>()
// );

// // Add a Task to a Todo List
// export const addTaskToList = createAction(
//   '[Todo] Add Task to List',
//   props<{ listId: string; task: Task }>()
// );

// // Successfully added a Task
// export const addTaskToListSuccess = createAction(
//   '[Todo] Add Task to List Success',
//   props<{ listId: string; task: Task }>()
// );

// // Toggle Task completion status
// export const toggleTaskCompletion = createAction(
//   '[Todo] Toggle Task Completion',
//   props<{ listId: string; taskIndex: number }>()
// );

// // Successfully toggled Task completion
// export const toggleTaskCompletionSuccess = createAction(
//   '[Todo] Toggle Task Completion Success',
//   props<{ listId: string; taskIndex: number; completed: boolean }>()
// );

// export const selectTodoList = createAction(
//   '[Todo] Select Todo List',
//   props<{ listId: string }>()
// );


// export const addTask = createAction(
//   '[Todo] Add Task',
//   props<{ listId: string; task: Task }>()
// );


// export const setSelectedTodoList = createAction(
//   '[Todo] Set Selected Todo List',
//   props<{ selectedList: TodoList }>()
// );


import { createAction, props } from '@ngrx/store';
import { TodoList, Task } from './../../features/todo/models/todo.model';

export const loadTodoLists = createAction('[Todo] Load Todo Lists');
export const loadTodoListsSuccess = createAction('[Todo] Load Todo Lists Success', props<{ todoLists: TodoList[] }>());
export const loadTodoListsFailure = createAction('[Todo] Load Todo Lists Failure', props<{ error: string }>());

export const loadTasks = createAction('[Todo] Load Tasks', props<{ listId: string }>());
export const loadTasksSuccess = createAction('[Todo] Load Task Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Todo] Load Task Failure', props<{ error: string }>())

export const setTasksForSelectedList = createAction('[Todo] Set Tasks for Selected Todo List', props<{ listId: string, tasks: Task[] }>());
export const setSelectedTodoListById = createAction('[Todo] Set Selected Todo List By ID', props<{ listId: string }>());

export const addTodoList = createAction('[Todo] Add Todo List', props<{ title: string }>());
export const addTask = createAction('[Todo] Add Task', props<{ listId: string, task: Omit<Task, '_id'> }>());
export const addTaskSuccess = createAction('[Todo] Add Task Success', props<{ listId: string, task: Task }>());
export const addTaskFailure = createAction('[Todo] Add Task Failure', props<{ error: string }>())
export const toggleTaskStatus = createAction('[Todo] Toggle Task Status', props<{ taskId: string }>());
export const toggleTaskCompletionSuccess = createAction('[Todo] Toggle Task Completion Success', props<{ taskId: string; completed: boolean }>());
export const toggleTaskCompletionFailure = createAction('[Todo] Toggle Task Completion Status Failure', props<{ error: string }>())

export const updateTask = createAction('[Todo] Update Task', props<{ listId: string, taskId: string, title: string, description: string }>());
export const setSelectedTodoList = createAction('[Todo] Set Selected Todo List', props<{ selectedList: TodoList }>());
export const clearSelectedList = createAction('[Todo] Clear Selected List');
