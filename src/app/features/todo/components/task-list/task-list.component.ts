import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TodoList } from '../../models/todo.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { selectTodoListById } from '../../../../store/selectors/todo.selectors';
import { addTask } from '../../../../store/actions/todo.actions';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() todoList: TodoList | undefined
  @Output() toggleTask = new EventEmitter<string>();
  @Output() addTask = new EventEmitter<{ title: string; description?: string }>();
  @Output() updateTask = new EventEmitter<{ taskId: string; title: string; description?: string }>();

  newTaskTitle = '';
  newTaskDescription = '';
  selectedListId: string | null = null;
  selectedList$: Observable<TodoList | undefined> | null = null;

  constructor(private store: Store) {}

  onSelectList(listId: string): void {
    this.selectedListId = listId;
    this.selectedList$ = this.store.select(selectTodoListById(listId));
  }


  submitTask(): void {
    if (!this.selectedListId || !this.newTaskTitle) return; // Check for missing values

    const taskWithCompleted = {
      id: uuidv4(),
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      completed: false,
    };

    this.store.dispatch(
      addTask({
        listId: this.selectedListId,
        task: taskWithCompleted,
      })
    );

    // Reset form fields after dispatching the action
    this.newTaskTitle = '';
    this.newTaskDescription = '';
  }

}

