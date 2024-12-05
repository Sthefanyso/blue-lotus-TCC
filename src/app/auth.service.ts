import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import {Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';  // URL da API Flask
  currentUser: any;
  unparsedUser: any;
  user: any;
  userId: any;

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

    return this.http.post<any>(`${this.apiUrl}/auth`, {}, { headers: headers }).pipe(
      tap((res) => {
        // Armazena os dados do usuário no login bem-sucedido
        this.currentUser = {
          id: res.id,
          email: res.email,
          name: res.name,
          surname: res.surname,
        };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        console.log(localStorage.getItem('user'));

      })
    );
  }

  getCurrentUser() {
    // Retorna o usuário logado
    return localStorage.getItem('user');
    
  }

  register(values: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, JSON.stringify(values), this.getHttpOptions());

  }
  
  requestPasswordReset(email: any): Observable<any> {
    console.log(email);
    return this.http.post(`${this.apiUrl}/reset_password`, email);
  }

  resetPassword(token: string, newPassword: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reset_password/newPassword/${token}`, { newPassword });
  }

  
  getFeelings(): Observable<{ [key: string]: string | null }> {
    const user = JSON.parse(this.getCurrentUser() || '{}');
    const userId = user.id;
  
    return this.http.get<{ [key: string]: string | null }>(`${this.apiUrl}/api/slots/feeling/${userId}`);
  }

  getFeelingsByMonth(): Observable<{ [key: string]: string | null }> {
    const user = JSON.parse(this.getCurrentUser() || '{}');
    const userId = user.id;
  
    return this.http.get<{ [key: string]: string | null }>(`${this.apiUrl}/api/feeling/month/${userId}`);
  }

}