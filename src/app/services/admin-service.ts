import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin, AdminLog } from '../models/admin.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}
  
  // SignUp
  signUp(admin: Admin): Observable<any> {
    const apiUrlSign = 'http://localhost:8080/initAdmin';
    return this.http.post(apiUrlSign, admin);
  }
}
