import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoList } from './../../features/todo/models/todo.model';


export const selectTodoState = createFeatureSelector<TodoList[]>('todos');

export const selectAllLists = createSelector(
  selectTodoState,
  (state) => state
);

export const selectTodoListById = (listId: string) => createSelector(
  selectAllLists,
  (lists) => lists.find(list => list.id === listId)
);


export const selectTodoListsSummary = createSelector(
  selectAllLists,
  (lists) =>
    lists.map(list => ({
      ...list,
      totalTasks: list.tasks.length,
      completedTasks: list.tasks.filter(t => t.completed).length
    }))
);
