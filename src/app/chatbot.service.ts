import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private rasaEndpoint = 'http://localhost:5005/webhooks/rest/webhook';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, id: any): Observable<any> {
    console.log(id);
    const payload = {
      sender: id,
      message: message
    };
    return this.http.post<any>(this.rasaEndpoint, payload);
  }
}

