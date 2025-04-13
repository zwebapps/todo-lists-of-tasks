import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SnackbarService } from '../../../../shared/services/SnakeBarService';
import { addTodoList, updateTodoList } from '../../../../store/actions/todo.actions';
import { TodoList } from '../../models/todo.model';
import { AddTaskFormComponent } from '../add-task-form/add-task-form.component';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-add-todo-list',
  imports: [SharedModule],
  templateUrl: './add-todo-list.component.html',
  styleUrl: './add-todo-list.component.scss'
})
export class AddTodoListComponent {
  @Output() addTodoList = new EventEmitter<{ title: string; description?: string }>();
  @Output() updateTodoList = new EventEmitter<{ listId: string; title: string; description?: string }>();
  snackbar = inject(SnackbarService);
  listId: string = '';
  listToEdit?: TodoList;
  isEditMode = false;

  // Adding form for new task
  todolistForm!: FormGroup;
  constructor( private store: Store, private fb: FormBuilder, private dialogRef: MatDialogRef<AddTaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
    if ('_id' in this.data) {
      // This is edit mode
      this.listToEdit = this.data as TodoList;
      this.isEditMode = true;
    } else {
      // This is add mode
      this.isEditMode = false;
    }
  }

  ngOnInit(): void {
    // Define the form once
    this.todolistForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
    });

    // If it's edit mode, patch values
    if (this.isEditMode && this.listToEdit) {
      const { title } = this.listToEdit;
      this.todolistForm.patchValue({ title });
    }
  }

submitTask(): void {
  if (this.todolistForm.valid) {
    const taskData = this.todolistForm.value;

    if (this.isEditMode && this.listToEdit?._id) {
      // Edit Task
      this.store.dispatch(updateTodoList({
        listId: this.listToEdit!._id,
        title: taskData.title
      }));
      this.snackbar.showFeedback('Todolist updated successfully!', 'success');
    } else {
      // Add Task
      this.store.dispatch(addTodoList({
        title: taskData.title
      }));
      this.snackbar.showFeedback('Todolist added successfully!', 'success');
    }

    this.dialogRef.close();
    this.todolistForm.reset();

  } else {
    this.todolistForm.markAllAsTouched();
    this.snackbar.showFeedback('Please fill out all required fields.', 'error');
  }
}


  get f() {
    return this.todolistForm.controls;
  }

}
