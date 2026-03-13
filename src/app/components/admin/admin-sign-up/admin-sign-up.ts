import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Admin, AdminLog } from '../../../models/admin.model';
import { UserService } from '../../../services/user-service';
import { AdminService } from '../../../services/admin-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-sign-up.html',
  styleUrl: './admin-sign-up.scss',
})
export class AdminSignUp {
  mode: 'login' | 'signup' = 'login';
  siteName = 'Iuvenis';
  details = [
    'Sammeln Sie Belohnungen fürs regelmäßige Einkaufen.',
    'Einfach und entspannt den QR-Code scannen.',
    'Kein Papier, keine Stempelkarte – alles digital.',
  ];

  adminLog: AdminLog = {
    email: '',
    password: '',
  };

  admin: Admin = {
    firstname: '',
    lastname: '',
    CompanyName: '',
    email: '',
    passwordhash: '',
    registrationdate: new Date(),
    birthdate: undefined as unknown as Date,
    seriesLimit: 0,
  };

  starterCode = '';
  streakLimit: number | null = null;
  companyName = '';
  email = '';
  password = '';
  passwordRepeat = '';
  formattedBirthdate = '';
  stayLogged = false;

  errMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private adminService: AdminService,
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
    this.router.navigate([this.mode === 'signup' ? '/adminSetUp' : '/adminLogin']);
  }

  login(): void {
    this.errMessage = null;
    this.successMessage = null;

    if (!this.email || !this.password) {
      this.errMessage = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    this.adminLog.email = this.email;
    this.adminLog.password = this.password;

    this.userService.login(this.adminLog, this.stayLogged).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/adminDashboard']);
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

    this.admin.birthdate = new Date(this.formattedBirthdate);
    this.admin.registrationdate = new Date();

    const validationError = this.userService.validateSignUp(this.admin, this.passwordRepeat);
    if (validationError) {
      this.errMessage = validationError;
      return;
    }

    this.adminService.signUp(this.admin).subscribe({
      next: () => {
        this.successMessage = 'Konto erfolgreich initalisiert. Sie können sich nun anmelden.';
        this.email = this.admin.email;
        this.password = '';
        this.mode = 'login';
        this.router.navigate(['/adminLogin']);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errMessage = 'Registrierung fehlgeschlagen.';
        this.cdr.detectChanges();
      },
    });
  }
}
