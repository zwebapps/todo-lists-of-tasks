import { inject, Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { loadTodoLists, loadTodoListsSuccess, addTask, addTodoList, loadTodoListsFailure, updateTask, toggleTaskStatus, addTodoListSuccess, addTaskToList, addTaskToListSuccess, toggleTaskCompletion, toggleTaskCompletionSuccess } from '../actions/todo.actions';
import { TodoList } from './../../features/todo/models/todo.model';
import { selectAllLists } from '../selectors/todo.selectors';
import { TodoService } from '../../features/todo/services/todo.service';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);
  private store = inject(Store);

  constructor() {
    console.log('Added correctly')
    }

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTodoLists),
      exhaustMap(() =>
        this.todoService.getTodos().pipe(
          map(lists => loadTodoListsSuccess({ todoLists: lists })),
          catchError(() => EMPTY)
        )
      )
    );
  });


  // Add Todo List
  addTodoList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addTodoList),
      mergeMap((action) =>
        this.todoService.addList(action.title).pipe(
          map((todoList) => addTodoListSuccess({ todoList })),
          catchError((error) => of(loadTodoListsFailure({ error })))
        )
      )
    )
  });

  // Add Task to List
  addTaskToList$ = createEffect(() => {
    return  this.actions$.pipe(
      ofType(addTaskToList),
      mergeMap((action) =>
        this.todoService.addTask(action.listId, action.task).pipe(
          map((task) => addTaskToListSuccess({ listId: action.listId, task })),
          catchError((error) => of(loadTodoListsFailure({ error })))
        )
      )
    )
  });

  toggleTaskCompletion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(toggleTaskCompletion),
      mergeMap((action) =>
        this.todoService.toggleTask(action.listId, action.taskIndex).pipe(
          map((task) =>
            toggleTaskCompletionSuccess({
              listId: action.listId,
              taskIndex: action.taskIndex,
              completed: task.completed,
            })
          ),
          catchError((error) => of(loadTodoListsFailure({ error })))
        )
      )
    )
  });
}
