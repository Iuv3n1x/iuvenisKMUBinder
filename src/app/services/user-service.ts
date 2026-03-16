import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserLog } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrlSign = `${environment.apiBaseUrl}/users`;
  private apiUrlLog = `${environment.apiBaseUrl}/login`;
  private apiUrlLogout = `${environment.apiBaseUrl}/logout`;

  constructor(private http: HttpClient) {}

  // SignUp
  signUp(user: User): Observable<any> {    
    return this.http.post(this.apiUrlSign, user);
  }

  validateSignUp(user: User, passwordRepeat: string): string | null {
    if (
      user.firstname.trim() === '' ||
      user.lastname.trim() === '' ||
      user.passwordhash.trim() === ''
    ) {
      return 'Bitte fülle alle Felder aus.';
    }

    if (user.passwordhash.length < 8) {
      return 'Bitte wählen Sie ein Passwort mit mindestens 8 Zeichen.';
    }

    if (!/\d/.test(user.passwordhash) || !/[^\w]/.test(user.passwordhash)) {
      return 'Bitte verwenden Sie Zahlen und Sonderzeichen in Ihrem Passwort.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return 'Bitte geben Sie eine korrekte Email Adresse ein.';
    }

    const now = new Date();
    const year = user.birthdate.getFullYear();

    if (year > now.getFullYear() || year < now.getFullYear() - 120) {
      return 'Bitte geben Sie ein korrektes Geburtsdatum an.';
    }

    if (user.passwordhash !== passwordRepeat) {
      return 'Passwörter stimmen nicht überein.';
    }
 
    return null;
  }

  // Login
  login(userLog: UserLog, stayLogged: boolean): Observable<any> {
    return this.http.post(this.apiUrlLog, { ...userLog, stayLogged }, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(this.apiUrlLogout, {}, { withCredentials: true });
  }
}
