import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private botResponses = [
    "That's an interesting question! Let me think about it.",
    "I understand what you're asking. Here's my perspective...",
    "Great question! Based on what you've shared, I'd say...",
    "Thanks for reaching out! I'm here to help with that.",
    'I see what you mean. Let me provide some insight on this topic.',
    "That's a thoughtful inquiry. Here's what I think...",
    "I'm glad you asked! This is actually quite common.",
    'Excellent point! Let me elaborate on that for you.',
    "I appreciate your question. Here's my take on it...",
    "That's definitely worth discussing. In my experience...",
  ];

  constructor() {
    // Add welcome message
    this.addMessage({
      id: this.generateId(),
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    });
  }

  sendMessage(text: string): void {
    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    this.addMessage(userMessage);

    // Simulate bot response with delay
    this.generateBotResponse(text).subscribe((response) => {
      this.addMessage(response);
    });
  }

  private addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private generateBotResponse(userMessage: string): Observable<Message> {
    const randomResponse =
      this.botResponses[Math.floor(Math.random() * this.botResponses.length)];

    const botMessage: Message = {
      id: this.generateId(),
      text: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    // Add some context-aware responses
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      botMessage.text =
        "Hello there! It's great to meet you. What would you like to chat about today?";
    } else if (lowerMessage.includes('help')) {
      botMessage.text =
        "I'm here to help! Feel free to ask me anything you'd like to know or discuss.";
    } else if (lowerMessage.includes('thank')) {
      botMessage.text = "You're very welcome! I'm happy to assist you anytime.";
    } else if (
      lowerMessage.includes('bye') ||
      lowerMessage.includes('goodbye')
    ) {
      botMessage.text =
        'Goodbye! It was nice chatting with you. Have a wonderful day!';
    }

    return of(botMessage).pipe(delay(1000 + Math.random() * 1000)); // 1-2 second delay
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
