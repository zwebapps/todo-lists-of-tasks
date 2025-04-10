import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoDetailComponent } from './features/todo/components/todo-detail/todo-detail.component';
// import { TodoListComponent } from './features/todo/components/todo-list/todo-list.component';
import { TodoContainerComponent } from './features/todo/pages/todo-container/todo-container.component';

const routes: Routes = [
  { path: '', component: TodoContainerComponent },
  // { path: '', component: TodoListComponent },
  { path: ':id', component: TodoDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
