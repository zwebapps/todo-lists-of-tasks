import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
// import { TodoContainerComponent } from "./features/todo/pages/todo-container/todo-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app';
}
