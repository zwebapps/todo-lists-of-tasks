

export interface Task {
  _id: string | undefined;
  title: string;
  description?: string;
  completed: boolean;
}

export interface TodoList {
  _id: string | undefined;
  title: string;
  totalTasks?: number;
  completedTasks?: number;
  tasks: Task[];
}
