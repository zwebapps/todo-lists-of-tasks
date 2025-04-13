import { Routes } from '@angular/router';
import { TodoDetailComponent } from './features/todo/components/todo-detail/todo-detail.component';
import { TodoContainerComponent } from './features/todo/pages/todo-container/todo-container.component';

export const routes: Routes = [
  { path: '', component: TodoContainerComponent },
  // { path: '', component: TodoListComponent },
  { path: ':id', component: TodoDetailComponent }
];

