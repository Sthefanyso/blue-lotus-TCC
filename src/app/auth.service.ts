import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import {Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';  // URL da API Flask

  constructor(private http: HttpClient, private router: Router) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  login(username: string, password: string): Observable<any> {
    const credentials = btoa(username + ':' + password); // Codificando as credenciais em Base64
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + credentials // Enviando o cabeçalho Authorization
    });

    return this.http.post<any>(`${this.apiUrl}/auth`, {}, { headers: headers }); // Enviando a solicitação POST com cabeçalho
  }

  register(values: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, JSON.stringify(values), this.getHttpOptions());

  }

  
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }

  resetPassword(token: string, newPassword: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { new_password: newPassword });
  }
}