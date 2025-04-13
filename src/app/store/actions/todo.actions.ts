
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
