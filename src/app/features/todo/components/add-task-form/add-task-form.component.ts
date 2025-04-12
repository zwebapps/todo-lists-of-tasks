import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { identity, Observable } from 'rxjs';
import { selectSelectedTodoList } from '../../../../store/selectors/todo.selectors';
import { TodoList, Task } from '../../models/todo.model';
import { SharedModule } from '../../../../shared/shared.module';
import { TodoService } from '../../services/todo.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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

  // Adding form for new task
  taskForm!: FormGroup;
  private todoService = inject(TodoService);
  constructor( private fb: FormBuilder, private dialogRef: MatDialogRef<AddTaskFormComponent>, @Inject(MAT_DIALOG_DATA) public listInfo: any){

  }

  ngOnInit(): void {
    console.log('listInfo',this.listInfo)
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.minLength(25)]],
      description: ['', Validators.minLength(150)],
      completed: [false]
    });
  }



toggleTask(task: Task): void {
  this.toggle.emit(task);
}


  submitTask(): void {
    console.log('New task creation form is submitted')
    if (this.taskForm.valid) {
      console.log('Form submitted:', this.taskForm.value);
      this.todoService.addTask(this.listInfo.listId, this.taskForm.value)
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  get f() {
    return this.taskForm.controls;
  }

}
