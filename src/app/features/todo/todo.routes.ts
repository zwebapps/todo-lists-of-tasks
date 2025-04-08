import { Routes } from '@angular/router';
import { TodoComponent } from './todo.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';


export const TODO_ROUTES: Routes = [
  { path: '', component: TodoComponent },
  { path: ':id', component: TodoDetailComponent },
];

