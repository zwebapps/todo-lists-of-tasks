import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Task, TodoList } from '../../models/todo.model';
import { selectSelectedTodoList, selectTodoLists } from '../../../../store/selectors/todo.selectors';
import { Store } from '@ngrx/store';
import { TaskListComponent } from '../task-list/task-list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { loadTasks, loadTodoLists, setSelectedTodoList, setSelectedTodoListById } from '../../../../store/actions/todo.actions';
import { ActivatedRoute, Route } from '@angular/router';
import { AddTaskFormComponent } from '../add-task-form/add-task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { shortendString } from '../../../../shared/commonUtils';

@Component({
  standalone: true,
  selector: 'app-todo-detail',
  imports: [SharedModule],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDetailComponent implements OnInit, OnChanges, DoCheck {
  @Input() listId: string | null = null;
  @Output() toggleTaskStatus = new EventEmitter<string>();
  selectedListId: string | null = null;
  selectedTaskList$: Observable<TodoList | null> | null = null;


  constructor(private store: Store, private route: ActivatedRoute, private dialog: MatDialog) {}



  ngDoCheck() {
    console.log('ngDoCheck triggered');
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listId'] && this.listId) {
      this.handleListId(this.listId);
    }
  }

  ngOnInit(): void {
    this.selectedTaskList$ = this.store.select(selectSelectedTodoList);

    // If `@Input()` has passed `listId`
    if (this.listId) {
      this.handleListId(this.listId);
    } else {
      // Else fallback to router param
      this.route.paramMap.pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        take(1) // Only once on init
      ).subscribe((id: string) => {
        this.handleListId(id);
      });
    }
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked triggered');
  }
  handleListId(id: string): void {
    // Load todo lists first if not already loaded
    this.store.select(selectTodoLists).pipe(take(1)).subscribe(lists => {
      if (!lists.length) {
        this.store.dispatch(loadTodoLists());
      }
    });

    // Wait for the list to be loaded, then dispatch setSelected and loadTasks
    this.store.select(selectTodoLists).pipe(
      filter(lists => lists.length > 0),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(setSelectedTodoListById({ listId: id }));
      this.store.dispatch(loadTasks({ listId: id }));
    });
  }

  trimTitle (title:string) {
     return shortendString(title);
    }
  deleteTask(task: Task) {
    console.log(task)
  }

  editTask(task: Task) {
    console.log(task)
  }

  onToggleTask(task: Task) {
    // Dispatch an action or call a service
    if(task._id)
    {
      this.toggleTaskStatus.emit(task._id);
    }
  }

  trackByTaskId(index: number, task: Task): string {
    if (!task._id) {
      throw new Error('Task must have a valid _id');
    }
    return task._id;
  }



  openTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskFormComponent, {
      width: '400px',
      data: { listId: this.selectedListId }
    });

    // Handle the closing of the dialog
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result)
    });
  }


}
