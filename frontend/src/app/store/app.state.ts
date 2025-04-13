// src/app/store/app.state.ts or app.reducer.ts
import { TodoState } from './reducers/todo.reducer'; // adjust path as needed

export interface AppState {
  todo: TodoState;
}
