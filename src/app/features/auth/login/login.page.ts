
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonIcon,
  IonButton,
  IonSpinner,
} from '@ionic/angular';
import { AuthService } from '../../../core/services/authService/authservice';
import { Router } from '@angular/router';
import { MessageService } from '../../../core/services/message/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonIcon,
    IonButton,
    IonSpinner,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  auth = inject(AuthService)
  private readonly msg = inject(MessageService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly loading = signal(false);
  readonly error = signal('');


  async submit(): Promise<void> {
    this.loading.set(true)
    try {
      await this.auth.login(this.form.value)
      this.msg.success(`Khush amdeed, ${this.auth.user()?.name ?? ''}`);
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      console.log(this.form)
    } catch (e:any) {
      if (!navigator.onLine) {
          this.msg.error('Internet Issue');
        } else if (e?.type === 'user_invalid_credentials') {
          this.msg.error('Email ya password galat hai');
        } else if (e?.type === 'user_blocked') {
          this.msg.error('Ye account block hai, admin se rabta karein');
        } else if (e?.code === 429) {
          this.msg.error('Bohat zyada koshish ho gayi, thori der baad dobara try karein');
        } else {
          this.msg.error(e?.message || 'Login nahi ho saka, dobara koshish karein');
        }
    } finally {
      this.loading.set(false)
    }
  }
}
