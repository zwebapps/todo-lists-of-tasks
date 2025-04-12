import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task, TodoList } from '../models/todo.model';
import { environment } from '../../../../environment';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoLists$ = new BehaviorSubject<TodoList[]>([]);
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
    const taskUrl = `${this.apiUrl}/${listId}/tasks`;
    return this.http.post<Task>(taskUrl, task).pipe(
      map((addedTask) => {
        const updatedLists = this.todoLists$.value.map((list) => {
          if (list?._id === listId) {
            return { ...list, tasks: [...list.tasks, addedTask] };
          }
          return list;
        });
        this.todoLists$.next(updatedLists);
        return addedTask;
      }),
      catchError((error) => {
        console.error('Error adding task:', error);
        throw error;
      })
    );
  }

  toggleTask(taskId: string): Observable<Task> {
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
}
