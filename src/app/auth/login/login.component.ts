import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(7), this.passwordValidator],
      ],
    });
  }

  passwordValidator(control: any) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
    return passwordPattern.test(control.value)
      ? null
      : { invalidPassword: true };
  }

  async login() {
    if (this.loginForm.invalid) {
      if (this.loginForm.get('email')?.hasError('required')) {
        alert('Email is required.');
      } else if (this.loginForm.get('email')?.hasError('email')) {
        alert('Invalid email format.');
      }

      if (this.loginForm.get('password')?.hasError('required')) {
        alert('Password is required.');
      } else if (this.loginForm.get('password')?.hasError('invalidPassword')) {
        alert(
          'Password must contain at least 7 characters and include uppercase, lowercase letters, and numbers.'
        );
      }
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Saving email:', email);
      localStorage.setItem('email', email);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      alert('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  }

  async ngOnInit() {
    this.loginForm.reset();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log('User already logged in:', user);
        this.router.navigate(['/dashboard']);
      } else {
        console.log('No user logged in on auth state subscription.');
      }
    });
  }
}
