import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { addTask, addTodoList, clearSelectedList, deleteTask, deleteTodoListSuccess, editTodoListSuccess, loadTodoLists, setSelectedTodoList, toggleTaskStatus } from '../../../../store/actions/todo.actions';
import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { selectSelectedTodoList, selectTodoLists } from '../../../../store/selectors/todo.selectors';
import { Task, TodoList } from '../../models/todo.model';
import { SharedModule } from '../../../../shared/shared.module';
import { Router } from '@angular/router';
import { TodoDetailComponent } from "../../components/todo-detail/todo-detail.component";
import { shortendString } from '../../../../shared/commonUtils';
import { SnackbarService } from '../../../../shared/services/SnakeBarService';
import { AddTodoListComponent } from '../../components/add-todo-list/add-todo-list.component';
import { DialogService } from '../../../../shared/services/DialogService';
import { TodoService } from '../../services/todo.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

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
  snackbar = inject(SnackbarService);
  dialog = inject(DialogService);
  todoService = inject(TodoService);
  modalVisible: any;


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



  onPanelClosed(list: TodoList) {
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
    this.selectedList$.subscribe(res => console.log('res',res))
    this. snackbar.showFeedback('Task status updated successfully', "success");
  }
  onDeleteTask(taskId: string){
    console.log('Delete task', taskId);
    this.store.dispatch(deleteTask({ taskId }));
  }

  patchTasksCount(selectedList: TodoList | null): number {
      return selectedList?.tasks?.length ?? 0;
  }
  patchCompletedTasksCount(selectedList: TodoList | null, list: TodoList): number {
    if (selectedList && selectedList._id === list._id) {
      return selectedList.completedTasks ?? 0;
    }
    return list?.completedTasks ?? 0;
  }

  trackByListId(index: number, list: TodoList) {
    return list._id;
  }
  trimTitle (title:string) {
   return shortendString(title);
  }

  openTaskDialog(): void {
   document.querySelector('app-root')?.setAttribute('inert', '');
   this.modalVisible = true;

   const dialogRef = this.dialog.open(AddTodoListComponent, {
     width: '400px',
     data: {},
   });

   dialogRef.afterClosed().subscribe(result => {
     document.querySelector('app-root')?.removeAttribute('inert');
     this.modalVisible = false;
     if (result) {
       console.log('Dialog result:', result);
     }
   });
  }

  editList(list: TodoList) {
    const dialogRef = this.dialog.open(AddTodoListComponent, {
      width: '300px',
      data: {...list }
    });

    dialogRef.afterClosed().subscribe((updatedTitle: string) => {
      if (updatedTitle) {
        const updatedList = { ...list, title: updatedTitle };
        if(list._id) {
          this.todoService.editList(list._id, { title: updatedTitle }).subscribe({
            next: (result) => {
              this.store.dispatch(editTodoListSuccess({ updatedList: result }));
              this.snackbar.showFeedback('List updated', 'success');
            },
            error: () => this.snackbar.showFeedback('Update failed', 'error')
          });
        }
      }
    });
  }

  deleteList(list: TodoList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: `Delete List: ${list.title}`,
        message: 'Are you sure you want to delete this list?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(list._id){
          this.todoService.deleteList(list._id).subscribe({
            next: () => {
              this.store.dispatch(deleteTodoListSuccess({ listId: list._id ?? ''}));
              this.snackbar.showFeedback('List deleted', 'success');
            },
            error: () => this.snackbar.showFeedback('Delete failed', 'error')
          });
        }
      }
    });
  }

}




