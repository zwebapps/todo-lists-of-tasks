import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared.module';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddTodoListComponent } from '../../features/todo/components/add-todo-list/add-todo-list.component';
import { TodoList } from '../../features/todo/models/todo.model';
import { TodoService } from '../../features/todo/services/todo.service';
import { DialogService } from '../services/DialogService';
import { SnackbarService } from '../services/SnakeBarService';

@Component({
  selector: 'app-navbar',
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  selectedListId: string | null = null;
  todoLists$: Observable<TodoList[]> | null = null;
  selectedList: TodoList | null = null;
  snackbar = inject(SnackbarService);
  dialog = inject(DialogService);
  todoService = inject(TodoService);
  modalVisible:boolean = false;

  constructor(private store: Store, private router: Router) {

  }



   openTaskDialog(): void {
     this.modalVisible = true;

     const dialogRef = this.dialog.open(AddTodoListComponent, {
       width: '400px',
       data: {},
       disableClose: true,
     })
   }

}
