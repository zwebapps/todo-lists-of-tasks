import { Component, OnInit } from '@angular/core';
import { addTask } from '../../../../store/actions/todo.actions';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTodoListById } from '../../../../store/selectors/todo.selectors';
import { TodoList } from '../../models/todo.model';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Component({
  standalone: true,
  selector: 'app-todo-container',
  imports: [TaskListComponent, CommonModule],
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss'],
})
export class TodoContainerComponent implements OnInit {
  selectedListId: string | null = null;
  selectedList$: Observable<TodoList | undefined> | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Optionally, load a default list when the component initializes
    // If needed, you can set a default selectedListId here or handle this later
  }

  onSelectList(listId: string): void {
    this.selectedListId = listId;
    this.selectedList$ = this.store.select(selectTodoListById(listId));
  }

  onAddTask(task: { title: string; description?: string }): void {
    if (!this.selectedListId) return;

    const taskWithCompleted = {
      id: uuidv4(),
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
}
