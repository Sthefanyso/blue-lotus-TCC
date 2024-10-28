import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';  // URL da API Flask

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  login(email: string, password: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, {email, password}, this.getHttpOptions(),
);
  }

  register(values: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, JSON.stringify(values), this.getHttpOptions());

  }
}
