import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user-service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  user: User = {
    firstname: '',
    lastname: '',
    email: '',
    passwordhash: '',
    registrationdate: new Date(),
    birthdate: undefined as unknown as Date,
  };

  passwordRepeat = '';

  formattedBirthdate: string = '';
  formattedRegistrationdate: string = '';

  constructor(
    private UserService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    const localReg = new Date(this.user.registrationdate.getTime() - this.user.registrationdate.getTimezoneOffset() * 60000);
    this.formattedRegistrationdate = localReg.toISOString().slice(0,16);
  }

  errMessage = '';
  successMessage = '';

  submit() {
    this.errMessage = '';
    this.successMessage = '';

    if (this.formattedBirthdate) {
      this.user.birthdate = new Date(this.formattedBirthdate);
    } else {
      this.errMessage = 'Bitte geben Sie Ihr Geburtsdatum ein.';
      return;
    }

    const now = new Date();
    now.setMilliseconds(0);
    this.user.registrationdate = now;
    
    const validationError = this.UserService.validateSignUp(this.user, this.passwordRepeat);

    if (validationError) {
      this.errMessage = validationError;
      return;
    }

    this.UserService.signUp(this.user).subscribe({
      next: (res) => {
        console.log('Added User!', res);
        this.successMessage = 'Konto erstellt. Sie können sich jetzt anmelden.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errMessage = 'Da ist etwas schiefgegangen. Wenn Sie bereits einen Account erstellt haben, melden Sie sich über die Login Seite an.';
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }
}