import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { UserLog } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  userLog: UserLog = {
    email: '',
    password: '',
  };

  email = '';
  password = '';
  errMessage: string | null = null;

  stayLogged = false;

  constructor(
    private UserService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errMessage = 'Bitte füllen Sie alle Felder aus.';
      return;
    }

    console.log('Send to backend: ', this.email, this.password);
    this.userLog.email = this.email;
    this.userLog.password = this.password;

    this.UserService.login(this.userLog, this.stayLogged).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('Logged in!', res);
          this.router.navigate(['/dashboard'])
        } else {
          this.errMessage = 'Email oder Passwort falsch.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.errMessage = 'Serverfehler, bitte später versuchen.';
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }
}
