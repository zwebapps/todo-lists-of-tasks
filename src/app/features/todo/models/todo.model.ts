export interface TodoState {
  todoLists: TodoList[];
  selectedList: TodoList | null;
  loading: boolean;
  error: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface TodoList {
  id: string;
  title: string;
  totalTasks?: number;
  completedTasks?: number;
  tasks: Task[];
}
