import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoContainerComponent } from './features/todo/pages/todo-container/todo-container.component';
import { MatCardModule } from '@angular/material/card';

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
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [AppComponent],
  bootstrap: []
})
export class AppModule { }
