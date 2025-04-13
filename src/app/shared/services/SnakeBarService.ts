// dialog.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor( private snackBar: MatSnackBar) {}

  showFeedback(message: string, type: 'success' | 'error'): void {
    const snackBarRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('Snackbar was dismissed');
    });
  }

}


