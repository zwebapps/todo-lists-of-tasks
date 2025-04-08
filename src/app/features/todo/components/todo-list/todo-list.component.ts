import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoList } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  @Input() lists: TodoList[] = [];
  @Output() selectList = new EventEmitter<string>();
  @Output() createList = new EventEmitter<string>();
}
