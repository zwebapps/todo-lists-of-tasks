import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { addTask, addTodoList, clearSelectedList, loadTodoLists, setSelectedTodoList, toggleTaskStatus } from '../../../../store/actions/todo.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedTodoList, selectTodoLists } from '../../../../store/selectors/todo.selectors';
import { TodoList } from '../../models/todo.model';
import { SharedModule } from '../../../../shared/shared.module';
import { Router } from '@angular/router';
import { TodoDetailComponent } from "../../components/todo-detail/todo-detail.component";
import { shortendString } from '../../../../shared/commonUtils';

@Component({
  standalone: true,
  selector: 'app-todo-container',
  imports: [SharedModule, TodoDetailComponent],
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoContainerComponent implements OnInit {
  readonly panelOpenState = signal(false);
  selectedListId: string | null = null;
  todoLists$: Observable<TodoList[]> | null = null;
  selectedList: TodoList | null = null;


  constructor(private store: Store, private router: Router) {
    this.store.dispatch(loadTodoLists());
  }

  ngOnInit(): void {
    this.todoLists$ = this.store.select(selectTodoLists);
  }


  onPanelOpened(list: TodoList) {
    if (this.selectedListId !== list._id) {
      this.selectedListId = list._id ?? null;

      // Dispatch action to load tasks if needed
      this.store.dispatch(setSelectedTodoList({ selectedList: list }));
    }
  }

  addList(){
    console.log("Add list is clicked")
  }


  onPanelClosed(list: TodoList) {
    console.log('closes on panel closed list', list)
    this.store.dispatch(clearSelectedList());
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
  onSelectList(list: TodoList) {
    this.selectedList = list;
    this.store.dispatch(setSelectedTodoList({ selectedList: list }));
    this.router.navigate([list._id]);
  }

  get selectedList$(): Observable<TodoList | null> {
    return this.store.select(selectSelectedTodoList);
  }
  onAddList(title: string) {
    this.store.dispatch(addTodoList({ title }));
  }

  onToggleTask(taskId: string) {
    this.store.dispatch(toggleTaskStatus({ taskId }));
  }
  trimTitle (title:string) {
   return shortendString(title);
  }
}
