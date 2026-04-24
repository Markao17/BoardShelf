import { Component, inject, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  imports: [FormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.scss',
})
export class AuthModal {
  private authService = inject(AuthService);
  public dialogRef = inject(DialogRef);
  private inputData = inject(DIALOG_DATA);

  // Signal to switch between 'login', 'signup' and 'magic-link'
  view = signal<'login' | 'signup' | 'magic'>(
    (this.inputData?.mode as 'login' | 'signup' | 'magic') || 'login',
  );

  email = '';
  password = '';

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
    this.dialogRef.close();
  }

  async handleEmailAuth() {
    if (this.view() === 'login') {
      await this.authService.loginWithEmail(this.email, this.password);
    } else {
      await this.authService.registerWithEmail(this.email, this.password);
    }
    this.dialogRef.close();
  }
}
