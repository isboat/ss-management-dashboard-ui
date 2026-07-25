import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private readonly snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  showWarning(message: string): void {
    this.show(message, 'warning');
  }

  showError(message: string): void {
    this.show(message, 'error');
  }

  private show(message: string, type: 'success' | 'warning' | 'error'): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      politeness: type === 'error' ? 'assertive' : 'polite',
      panelClass: [`app-notification--${type}`]
    });
  }
}
