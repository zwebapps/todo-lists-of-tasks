import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task, TodoList } from '../models/todo.model';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoLists$ = new BehaviorSubject<TodoList[]>([]);

  private apiUrl = 'https://shrimo.com/fake-api';

  private http = inject(HttpClient);

  constructor() {}

  // Fetch todo lists from the API
  // getTodos(): Observable<TodoList[]> {
  //   return this.http.get<TodoList[]>(this.apiUrl+'/todos').pipe(
  //     map((response) => {
  //       console.log('response', response)
  //       this.todoLists$.next(response);
  //       return response;
  //     })
  //   );
  // }

  getTodos(): Observable<TodoList[]> {
    return of([
      { id: '1', title: 'Work', tasks: [] },
      { id: '2', title: 'Personal', tasks: [] }
    ]);
  }


  // Get current lists as observable
  get lists(): Observable<TodoList[]> {
    return this.todoLists$.asObservable();
  }

  // Add a new list (this method sends data to the backend)
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

  // Add a new task to an existing list (this sends the task to the backend)
  addTask(listId: string, task: Task): Observable<Task> {
    const taskUrl = `${this.apiUrl}/${listId}/tasks`;
    return this.http.post<Task>(taskUrl, task).pipe(
      map((addedTask) => {
        const updatedLists = this.todoLists$.value.map((list) => {
          if (list.id === listId) {
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

  // Toggle the task completion status in the backend
  toggleTask(listId: string, taskIndex: number): Observable<Task> {
    const list = this.todoLists$.value.find((l) => l.id === listId);
    if (!list) {
      return new Observable(); // List not found, return an empty observable
    }
    const task = list.tasks[taskIndex];
    const taskUrl = `${this.apiUrl}/${listId}/tasks/${task.id}`;
    const updatedTask = { ...task, completed: !task.completed };

    return this.http.put<Task>(taskUrl, updatedTask).pipe(
      map(() => {
        const updatedLists = this.todoLists$.value.map((l) => {
          if (l.id === listId) {
            const updatedTasks = l.tasks.map((t, index) =>
              index === taskIndex ? updatedTask : t
            );
            return { ...l, tasks: updatedTasks };
          }
          return l;
        });
        this.todoLists$.next(updatedLists);
        return updatedTask;
      }),
      catchError((error) => {
        console.error('Error toggling task:', error);
        throw error;
      })
    );
  }
}
