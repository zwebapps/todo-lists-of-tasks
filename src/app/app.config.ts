// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideStore } from '@ngrx/store';
// import { todoReducer } from './store/reducers/todo.reducer';
// import { provideEffects } from '@ngrx/effects';
// import { TodoEffects } from './store/effects/todo.effects';
// import { provideHttpClient } from '@angular/common/http';



// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideStore({ todos: todoReducer }),
//     provideEffects(TodoEffects),
//     provideHttpClient(),
//   ]
// };


import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { todoReducer } from './store/reducers/todo.reducer';
import { TodoEffects } from './store/effects/todo.effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ todos: todoReducer }),
    provideEffects(TodoEffects),
    provideHttpClient()
  ]
};
