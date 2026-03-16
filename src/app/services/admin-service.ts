import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrlSign = `${environment.apiBaseUrl}/initAdmin`;

  constructor(private http: HttpClient) {}
  
  // SignUp
  signUp(admin: Admin): Observable<any> {
    return this.http.post(this.apiUrlSign, admin);
  }
}
