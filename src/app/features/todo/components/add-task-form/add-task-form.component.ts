import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoList, Task } from '../../models/todo.model';
import { SharedModule } from '../../../../shared/shared.module';
import { TodoService } from '../../services/todo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addTask, updateTask } from '../../../../store/actions/todo.actions';
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
  listId: string = '';
  taskToEdit?: Task;
  isEditMode = false;

  // Adding form for new task
  taskForm!: FormGroup;
  constructor( private store: Store, private fb: FormBuilder, private dialogRef: MatDialogRef<AddTaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any){

    if ('_id' in this.data) {
      // This is edit mode
      this.taskToEdit = this.data as Task;
      this.isEditMode = true;
    } else {
      // This is add mode
      this.listId = data.listId;
      this.isEditMode = false;
    }
  }

  ngOnInit(): void {
    // Define the form once
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      description: ['', Validators.maxLength(150)],
      completed: [false],
    });

    // If it's edit mode, patch values
    if (this.isEditMode && this.taskToEdit) {
      const { title, description, completed } = this.taskToEdit;
      this.taskForm.patchValue({ title, description, completed });
    }
  }



toggleTask(task: Task): void {
  this.toggle.emit(task);
}


submitTask(): void {
  if (this.taskForm.valid) {
    const taskData = this.taskForm.value;

    if (this.isEditMode && this.taskToEdit?._id) {
      // Edit Task
      this.store.dispatch(updateTask({
        taskId: this.taskToEdit!._id,
        title: taskData.title,
        description: taskData.description,
        completed: taskData.completed
      }));
      this.snackbar.showFeedback('Task updated successfully!', 'success');
    } else if (this.listId) {
      // Add Task
      this.store.dispatch(addTask({
        listId: this.listId,
        task: taskData
      }));
      this.snackbar.showFeedback('Task added successfully!', 'success');
    }

    this.dialogRef.close();
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
