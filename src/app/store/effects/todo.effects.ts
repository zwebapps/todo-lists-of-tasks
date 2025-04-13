import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap,
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
  loadTasks,
  loadTasksSuccess,
  toggleTaskCompletionSuccess,
  toggleTaskCompletionFailure,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure,
  updateTask,
  updateTaskSuccess,
  updateTaskFailure,
  setSelectedTodoListById,
  addTodoListSuccess,
  updateTodoList,
  updateTodoListSuccess,
  updateTodoListFailure,
} from '../actions/todo.actions';
import { TodoService } from '../../features/todo/services/todo.service';
import { EMPTY, of } from 'rxjs';
import { SnackbarService } from '../../shared/services/SnakeBarService';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);
  private snackbar = inject(SnackbarService)



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

  loadTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTasks),
      switchMap((action) =>
        this.todoService.getTasks(action.listId).pipe(
          map(tasks => loadTasksSuccess({tasks}),
          catchError((error) =>
            of(loadTodoListsFailure({ error: error.message }))
          )
        )
      )
    ))
  })

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
          map((todoList) => addTodoListSuccess({ newList: todoList })),
          catchError((error) => of(loadTodoListsFailure({ error })))
        )
      )
    );
  });


  updateTodoList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTodoList),
      switchMap(({ listId, title }) =>
        this.todoService.editList(listId, { title }).pipe(
          map(() => {
            this.snackbar.showFeedback('Todo List updated successfully', 'success');
            return loadTodoLists();
          }),
          catchError((error) => {
            this.snackbar.showFeedback('Error updating Todo List', 'error');
            return of(updateTaskFailure({ error: error.message }));
          })
        )
      )
    )
  );



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
          map((task) => {
            return toggleTaskCompletionSuccess({
              taskId: action.taskId,
              completed: task.completed,
            });
          }),
          catchError((error) => of(toggleTaskCompletionFailure({ error })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),
      mergeMap(({ taskId }) =>
        this.todoService.deleteTask(taskId).pipe(
          map(() => deleteTaskSuccess({ taskId })),
          catchError((error) => of(deleteTaskFailure({ error })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTask),
      switchMap(({ taskId, title, description, completed }) =>
        this.todoService.updateTask(taskId, { title, description, completed }).pipe(
          map(updatedTask => updateTaskSuccess({ updatedTask })),
          catchError(error => of(updateTaskFailure({ error: error.message })))
        )
      )
    )
  );


  updateTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTaskSuccess),
      tap(() => {
        this.snackbar.showFeedback('Task updated successfully', 'success');
      })
    ),
    { dispatch: false }
  );

  updateTaskFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTaskFailure),
      tap(({ error }) => {
        this.snackbar.showFeedback(`Error: ${error}`, 'error');
      })
    ),
    { dispatch: false }
  );

  loadTasksForSelectedList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSelectedTodoListById),
      switchMap(({ listId }) =>
        this.todoService.getTasks(listId).pipe(
          map(tasks => loadTasksSuccess({ tasks })),
          catchError(error => of(loadTodoListsFailure({ error: error.message })))
        )
      )
    )
  );
  dialogRef: any;





}
