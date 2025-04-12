import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/todo.reducer';

// Feature selector for TodoState
export const selectTodoState = createFeatureSelector<TodoState>('todo');


// Select all todo lists
export const selectTodoLists = createSelector(
  selectTodoState,
  (state: TodoState) => state.todoLists
);


export const selectSelectedTodoList = createSelector(
  selectTodoState,
  (state: TodoState) => {
    return state.selectedList ?? null
  }
);

// Select loading state
export const selectLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.loading
);

// Select error state
export const selectError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);
