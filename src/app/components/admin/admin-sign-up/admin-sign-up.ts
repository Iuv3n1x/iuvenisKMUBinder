import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Admin } from '../../../models/admin.model';
import { UserService } from '../../../services/user-service';
import { AdminService } from '../../../services/admin-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-sign-up.html',
  styleUrl: './admin-sign-up.scss',
})
export class AdminSignUp {
  siteName = 'Iuvenis';
  details = [
    'Sammeln Sie Belohnungen fürs regelmäßige Einkaufen.',
    'Einfach und entspannt den QR-Code scannen.',
    'Kein Papier, keine Stempelkarte – alles digital.',
  ];

  admin: Admin = {
    firstname: '',
    lastname: '',
    companyName: '',
    starterCode: '',
    email: '',
    passwordhash: '',
    registrationdate: new Date(),
    birthdate: undefined as unknown as Date,
    seriesLimit: 1,
  };

  starterCode = '';
  streakLimit: number | null = null;
  companyName = '';
  passwordRepeat = '';
  formattedBirthdate = '';

  errMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private userService: UserService, private adminService: AdminService, private cdr: ChangeDetectorRef, private router: Router) {}

  signup(): void {
    this.errMessage = null;
    this.successMessage = null;

    if (!this.formattedBirthdate) {
      this.errMessage = 'Bitte geben Sie Ihr Geburtsdatum an.';
      return;
    }

    this.admin.birthdate = new Date(this.formattedBirthdate);
    this.admin.registrationdate = new Date();
    this.admin.companyName = this.companyName.trim();
    this.admin.starterCode = this.starterCode.trim();
    this.admin.seriesLimit = this.streakLimit ?? 1;

    const validationError = this.userService.validateSignUp(this.admin, this.passwordRepeat);
    if (validationError) {
      this.errMessage = validationError;
      return;
    }

    this.adminService.signUp(this.admin).subscribe({
      next: () => {
        this.successMessage = 'Konto erfolgreich initialisiert.';
        this.cdr.detectChanges();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errMessage = 'Registrierung fehlgeschlagen.';
        this.cdr.detectChanges();
      },
    });
  }
}

// TODO: Add verification of the forms in own service
// TODO: Input in PostgreSQL not correct right now. Fix it.
