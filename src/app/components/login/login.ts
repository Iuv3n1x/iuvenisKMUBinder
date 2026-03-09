import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserLog } from '../../models/user.model';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  mode: 'login' | 'signup' = 'login';
  siteName = 'KMU BINDER';
  details = [
    'Secure account access for your workspace',
    'Fast onboarding with guided validation',
    'Session-based authentication with cookie sessions',
  ];

  userLog: UserLog = {
    email: '',
    password: '',
  };

  user: User = {
    firstname: '',
    lastname: '',
    email: '',
    passwordhash: '',
    registrationdate: new Date(),
    birthdate: undefined as unknown as Date,
  };

  email = '';
  password = '';
  passwordRepeat = '';
  formattedBirthdate = '';
  stayLogged = false;

  errMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.mode = path === 'signup' ? 'signup' : 'login';
  }

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.errMessage = null;
    this.successMessage = null;
    this.router.navigate([this.mode === 'signup' ? '/signup' : '/login']);
  }

  login(): void {
    this.errMessage = null;
    this.successMessage = null;

    if (!this.email || !this.password) {
      this.errMessage = 'Please fill in all login fields.';
      return;
    }

    this.userLog.email = this.email;
    this.userLog.password = this.password;

    this.userService.login(this.userLog, this.stayLogged).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errMessage = 'Email or password is incorrect.';
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errMessage = 'Server error, please try again later.';
        this.cdr.detectChanges();
      },
    });
  }

  signup(): void {
    this.errMessage = null;
    this.successMessage = null;

    if (!this.formattedBirthdate) {
      this.errMessage = 'Please provide your birth date.';
      return;
    }

    this.user.birthdate = new Date(this.formattedBirthdate);
    this.user.registrationdate = new Date();

    const validationError = this.userService.validateSignUp(this.user, this.passwordRepeat);
    if (validationError) {
      this.errMessage = validationError;
      return;
    }

    this.userService.signUp(this.user).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully. You can now log in.';
        this.email = this.user.email;
        this.password = '';
        this.mode = 'login';
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errMessage = 'Signup failed. If this email already exists, please log in.';
        this.cdr.detectChanges();
      },
    });
  }
}
