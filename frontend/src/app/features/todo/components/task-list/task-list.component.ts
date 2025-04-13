import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TodoList } from '../../models/todo.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { addTask } from '../../../../store/actions/todo.actions';
import { selectSelectedTodoList } from '../../../../store/selectors/todo.selectors';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [SharedModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input() todoList: TodoList | undefined
  @Input() tasks: Task[] | undefined;
  @Output() addTask = new EventEmitter<{ title: string; description?: string }>();
  @Output() updateTask = new EventEmitter<{ taskId: string; title: string; description?: string }>();
  @Output() toggle = new EventEmitter<Task>();
  selectedListId: string | null = null;
  selectedList$: Observable<TodoList | null> | null = null;

  // Adding form for new task
  taskForm!: FormGroup;

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.minLength(25)]],
      description: ['', Validators.minLength(150)],
      completed: [false]
    });
  }

  onSelectList(listId: string): void {
    this.selectedListId = listId;
    this.selectedList$ = this.store.select(selectSelectedTodoList);
  }


toggleTask(task: Task): void {
  this.toggle.emit(task);
}


  submitTask(): void {
    console.log('New task creation form is submitted')
    if (this.taskForm.valid) {
      console.log('Form submitted:', this.taskForm.value);
    } else {
      this.taskForm.markAllAsTouched();
    }

    // this.store.dispatch(
    //   addTask({
    //     listId: this.selectedListId,
    //     task: taskWithCompleted,
    //   })
    // );


  }

  get f() {
    return this.taskForm.controls;
  }

}

