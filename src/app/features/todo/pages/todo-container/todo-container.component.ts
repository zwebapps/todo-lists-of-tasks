import { Component, OnInit } from '@angular/core';
import { addTask, addTodoList, loadTodoLists, toggleTaskStatus } from '../../../../store/actions/todo.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedTodoList, selectTodoLists } from '../../../../store/selectors/todo.selectors';
import { TodoList } from '../../models/todo.model';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-todo-container',
  imports: [SharedModule],
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss'],
})
export class TodoContainerComponent implements OnInit {
  selectedListId: string | null = null;
  todoLists$: Observable<TodoList[]> | null = null;

  constructor(private store: Store) {
    this.store.dispatch(loadTodoLists());
  }

  ngOnInit(): void {
    this.todoLists$ = this.store.select(selectTodoLists);
  }

  onAddTask(task: { title: string; description?: string }): void {
    if (!this.selectedListId) return;

    const taskWithCompleted = {
      ...task,
      completed: false,
    };

    this.store.dispatch(
      addTask({
        listId: this.selectedListId,
        task: taskWithCompleted,
      })
    );
  }
  onSelectList(listId: string) {
    this.selectedListId = listId;
  }

  get selectedList$(): Observable<TodoList | null> {
    return this.store.select(selectSelectedTodoList);
  }
  onAddList(title: string) {
    this.store.dispatch(addTodoList({ title }));
  }

  onToggleTask(taskId: string) {
    if (!this.selectedListId) return;
    this.store.dispatch(toggleTaskStatus({ listId: this.selectedListId, taskId }));
  }
  trimTitle (title:string) {
   return title.trim().substring(0, 15);
  }
}
