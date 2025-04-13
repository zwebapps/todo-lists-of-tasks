import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoList, Task } from '../../models/todo.model';
import { SharedModule } from '../../../../shared/shared.module';
import { TodoService } from '../../services/todo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addTask } from '../../../../store/actions/todo.actions';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../../shared/services/SnakeBarService';

@Component({
  standalone: true,
  selector: 'app-add-task-form',
  imports: [SharedModule],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss'
})
export class AddTaskFormComponent {
  @Input() todoList: TodoList | undefined
  @Output() addTask = new EventEmitter<{ title: string; description?: string }>();
  @Output() updateTask = new EventEmitter<{ taskId: string; title: string; description?: string }>();
  @Output() toggle = new EventEmitter<Task>();
  snackbar = inject(SnackbarService);
  listId: string;

  // Adding form for new task
  taskForm!: FormGroup;
  constructor( private store: Store, private fb: FormBuilder, private dialogRef: MatDialogRef<AddTaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    this.listId = data.listId;
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      description: ['', Validators.maxLength(150)],
      completed: [false]
    });
  }



toggleTask(task: Task): void {
  this.toggle.emit(task);
}


  submitTask(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      const listId = this.listId;
      this.store.dispatch(addTask({ listId, task: taskData }));
       this.snackbar.showFeedback('Task added successfully!', 'success');
       this.taskForm.reset();
    } else {
      this.taskForm.markAllAsTouched();
      this.snackbar.showFeedback('Please fill out all required fields.', 'error');
    }
  }

  get f() {
    return this.taskForm.controls;
  }



}
