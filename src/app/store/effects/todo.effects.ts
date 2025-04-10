import { inject, Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';
import {
  loadTodoLists,
  loadTodoListsSuccess,
  loadTodoListsFailure,
  addTodoList,
  addTask,
  toggleTaskStatus,
  addTaskSuccess,
  addTaskFailure,
} from '../actions/todo.actions';
import { TodoService } from '../../features/todo/services/todo.service';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);

  // Effect to load Todo Lists
  loadTodoLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTodoLists),
      switchMap(() =>
        this.todoService.getTodos().pipe(
          map((todoLists) => loadTodoListsSuccess({ todoLists })),
          catchError((error) =>
            of(loadTodoListsFailure({ error: error.message }))
          )
        )
      )
    );
  });

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTodoLists),
      exhaustMap(() =>
        this.todoService.getTodos().pipe(
          map((lists) => loadTodoListsSuccess({ todoLists: lists })),
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
          map((todoList) => loadTodoListsSuccess({ todoLists: [todoList] })),
          catchError((error) => of(loadTodoListsFailure({ error })))
        )
      )
    );
  });

  addTaskToList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTask),
      mergeMap((action) =>
        this.todoService.addTask(action.listId, action.task).pipe(
          map((returnedTask) =>
            addTaskSuccess({ listId: action.listId, task: returnedTask })
          ),
          catchError((error) => of(addTaskFailure({ error })))
        )
      )
    )
  );

  toggleTaskCompletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleTaskStatus),
      mergeMap((action) =>
        this.todoService.toggleTask(action.taskId).pipe(
          map(() => loadTodoLists()),
          catchError((error) => of(loadTodoListsFailure({ error })))
        )
      )
    )
  );
}
