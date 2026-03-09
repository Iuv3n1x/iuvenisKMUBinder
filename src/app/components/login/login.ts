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
  siteName = 'Iuvenis';
  details = [
    'Sammeln Sie Belohnungen fürs regelmäßige Einkaufen.',
    'Einfach und entspannt den QR-Code scannen.',
    'Kein Papier, keine Stempelkarte – alles digital.',
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
      this.errMessage = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    this.userLog.email = this.email;
    this.userLog.password = this.password;

    this.userService.login(this.userLog, this.stayLogged).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errMessage = 'Email oder Passwort falsch.';
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errMessage = 'Server Fehler, bitte versuchen Sie es später erneut.';
        this.cdr.detectChanges();
      },
    });
  }

  signup(): void {
    this.errMessage = null;
    this.successMessage = null;

    if (!this.formattedBirthdate) {
      this.errMessage = 'Bitte geben Sie Ihr Geburtsdatum an.';
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
        this.successMessage = 'Konto erfolgreich erstellt. Sie können sich nun anmelden.';
        this.email = this.user.email;
        this.password = '';
        this.mode = 'login';
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errMessage = 'Registrierung fehlgeschlagen. Wenn Sie bereits ein Konto angelegt haben, melden Sie sich an.';
        this.cdr.detectChanges();
      },
    });
  }
}
