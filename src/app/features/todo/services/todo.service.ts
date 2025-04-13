import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Task, TodoList } from '../models/todo.model';
import { environment } from '../../../../environment';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoLists$ = new BehaviorSubject<TodoList[]>([]);
  private selectedList$ = new BehaviorSubject<TodoList>({} as TodoList);
  private tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {
    console.log('apiUrl', this.apiUrl)
  }

  getTodos(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(this.apiUrl+'/lists').pipe(
      map((response) => {
        console.log('response', response)
        this.todoLists$.next(response);
        return response;
      })
    );
  }

  get lists(): Observable<TodoList[]> {
    return this.todoLists$.asObservable();
  }

  getTasks(listId: string) : Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl+`/lists/${listId}/tasks`).pipe(
      map((response) => {
        console.log('response', response)
        this.tasks$.next(response);
        return response;
      })
    );
  }

  addList(title: string): Observable<TodoList> {
    const newList = { id: crypto.randomUUID(), title, tasks: [] };
    return this.http.post<TodoList>(this.apiUrl, newList).pipe(
      map((createdList) => {
        const updatedLists = [...this.todoLists$.value, createdList];
        this.todoLists$.next(updatedLists);
        return createdList;
      }),
      catchError((error) => {
        console.error('Error adding todo list:', error);
        throw error;
      })
    );
  }


  addTask(listId: string, task: Omit<Task, '_id'>): Observable<Task> {
    const taskUrl = `${this.apiUrl}/lists/${listId}/tasks`;
    return this.http.post<Task>(taskUrl, task).pipe(
      map((addedTask) => {
        const currentList = this.selectedList$.value;
        if (currentList && currentList._id === listId) {
          const updatedList = {
            ...currentList,
            tasks: [...currentList.tasks, addedTask],
          };
          this.selectedList$.next(updatedList);
        }
        return addedTask;
      }),
      catchError((error) => {
        console.error('Error adding task:', error);
        throw error;
      })
    );
  }


  toggleTask(taskId: string): Observable<Task> {
    console.log('toggleTask', taskId)
    const taskUrl = `${this.apiUrl}/tasks/${taskId}/toggle`;
    return this.http.patch<Task>(taskUrl, {}).pipe(
      map((updatedTask: Task) => {
        return updatedTask;
      }),
      catchError(error => {
        console.error('Error toggling task:', error);
        return throwError(() => error);
      })
    );
  }

  deleteTask(taskId: string): Observable<{ success: boolean; taskId: string }> {
    const taskUrl = `${this.apiUrl}/tasks/${taskId}`;
    return this.http.delete<{ success: boolean; taskId: string }>(taskUrl).pipe(
      tap(() => console.log('Deleted Task ID:', taskId)),
      catchError((error) => {
        console.error('Error deleting task:', error);
        return throwError(() => error);
      })
    );
  }


  updateTask(taskId: string, taskData: Partial<Task>): Observable<Task> {
    const taskUrl = `${this.apiUrl}/tasks/${taskId}`;
    return this.http.put<Task>(taskUrl, taskData).pipe(
      map((updatedTask: Task) => updatedTask),
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => error);
      })
    );
  }




}
