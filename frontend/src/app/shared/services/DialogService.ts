// dialog.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open<T, D = any>(component: ComponentType<T>, data?: D, width: string = '500px') {
    return this.dialog.open(component, {
      width,
      ...data
    });
  }

}
