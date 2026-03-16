import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  private checkUrl = `${environment.apiBaseUrl}/auth/check`;

  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    return this.http.get(this.checkUrl, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
