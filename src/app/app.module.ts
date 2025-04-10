import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/reducers/todo.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './store/effects/todo.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TodoContainerComponent } from './features/todo/pages/todo-container/todo-container.component';
import { MatCardModule } from '@angular/material/card';
import { TodoService } from './features/todo/services/todo.service';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TodoContainerComponent,
    AppComponent,
    FormsModule,
    MatCardModule
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AppComponent],
  bootstrap: []
})
export class AppModule { }
