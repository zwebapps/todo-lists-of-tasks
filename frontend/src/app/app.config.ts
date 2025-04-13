import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ActionReducer, MetaReducer, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { todoReducer } from './store/reducers/todo.reducer';
import { TodoEffects } from './store/effects/todo.effects';
import { provideHttpClient } from '@angular/common/http';
import { AppState } from './store/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';


export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: ['todo'],
    rehydrate: true,
  })(reducer);
}


const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ todo: todoReducer }, { metaReducers }),
    provideEffects(TodoEffects),
    provideHttpClient()
  ]
};
