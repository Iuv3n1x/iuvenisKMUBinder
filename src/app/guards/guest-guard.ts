import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class guestGuard implements CanActivate {

  private checkUrl = 'http://localhost:8080/auth/check';

  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    return this.http.get(this.checkUrl, { withCredentials: true }).pipe(
      map(() => {
        this.router.navigate(['/dashboard']);
        return false;
      }),
      catchError(() => {
        return of(true);
      })
    );
  }
}