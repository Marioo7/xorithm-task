import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.email, this.emailValidator],
        ],
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  emailValidator(control: any) {
    const validEmailPattern = /^.+\.com$/;
    return validEmailPattern.test(control.value)
      ? null
      : { invalidEmail: true };
  }

  passwordValidator(control: any) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
    return passwordPattern.test(control.value)
      ? null
      : { invalidPassword: true };
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async signup() {
    const { email, password, username } = this.signupForm.value;

    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);

      localStorage.setItem('email', email);

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.code === 'auth/email-already-in-use') {
        alert('The email address is already in use by another account.');
      } else {
        alert('Signup error: ' + error.message);
      }
    }
  }
}
