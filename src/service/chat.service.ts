import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Message } from '../model/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Add welcome message
    this.addMessage({
      id: this.generateId(),
      sender: 'bot',
      timestamp: new Date(),
      response: {
        type: 'Other',
        formConfig: null,
        text: "Hello! I'm your AI assistant. How can I help you today?",
      },
    });
  }

  sendMessage(text: string): void {
    const userMessage: Message = {
      id: this.generateId(),
      sender: 'user',
      timestamp: new Date(),
      response: {
        type: 'Other',
        text: text,
        formConfig: null,
      },
    };

     this.addMessage(userMessage);

    this.getGenAIResponse({ prompt: text }).subscribe((data) => {
      const botMessage: Message = {
        id: this.generateId(),
        sender: 'bot',
        timestamp: new Date(),
        response: data
      };

      this.addMessage(botMessage);
    });
  }

  private addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getGenAIResponse(promptData: { prompt: string }): Observable<any> {
    const url = 'http://localhost:3000/api/generate-form';
    return this.http.post(url, promptData);
  }
}
