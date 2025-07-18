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
    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      sender: 'user',
      timestamp: new Date(),
      response: {
        type: 'Other',
        formConfig: null,
        text: text,
      },
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
      sender: 'bot',
      timestamp: new Date(),
      response: {
        type: 'Other',
        formConfig: null,
        text: randomResponse,
      },
    };

    // Add some context-aware responses
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      // botMessage.response.text =
      //   "Hello there! It's great to meet you. What would you like to chat about today?";
      botMessage.response = {
        type: 'Form',
        text:'',
        formConfig: {
          name: 'updatePersonalDetails',
          title: 'Update Personal Details',
          subtitle: 'Keep your information up to date',
          fields: [
            {
              key: 'fullName',
              label: 'Full Name',
              type: 'text',
              placeholder: 'Enter your full name',
              validations: [
                { type: 'required', message: 'Full name is required' },
                {
                  type: 'minLength',
                  value: 2,
                  message: 'Minimum 2 characters required',
                },
              ],
            },
            {
              key: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: 'Enter your email address',
              validations: [
                { type: 'required', message: 'Email is required' },
                { type: 'email', message: 'Invalid email format' },
              ],
            },
            {
              key: 'dob',
              label: 'Date of Birth',
              type: 'date',
              placeholder: 'Select your date of birth',
              validations: [
                { type: 'required', message: 'Date of birth is required' },
              ],
            },
            {
              key: 'gender',
              label: 'Gender',
              type: 'select',
              placeholder: 'Select gender',
              options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ],
              validations: [
                { type: 'required', message: 'Gender is required' },
              ],
            },
            {
              key: 'profilePhoto',
              label: 'Profile Photo',
              type: 'file',
              placeholder: 'Upload a profile photo',
              accept: ['image/jpeg', 'image/png'],
              validations: [
                { type: 'required', message: 'Profile photo is required' },
                {
                  type: 'fileType',
                  value: ['image/jpeg', 'image/png'],
                  message: 'Only JPEG or PNG allowed',
                },
              ],
            },
          ],
          buttons: [
            {
              key: 'submit',
              label: 'Update',
              type: 'submit',
              variant: 'primary',
              iconRight: 'user-check',
            },
            {
              key: 'cancel',
              label: 'Cancel',
              type: 'button',
              variant: 'secondary',
              iconRight: 'x',
            },
          ],
        },
      };
    } else if (lowerMessage.includes('help')) {
      botMessage.response.text =
        "I'm here to help! Feel free to ask me anything you'd like to know or discuss.";
    } else if (lowerMessage.includes('thank')) {
      botMessage.response.text =
        "You're very welcome! I'm happy to assist you anytime.";
    } else if (
      lowerMessage.includes('bye') ||
      lowerMessage.includes('goodbye')
    ) {
      botMessage.response.text =
        'Goodbye! It was nice chatting with you. Have a wonderful day!';
    }

    return of(botMessage).pipe(delay(1000 + Math.random() * 1000)); // 1-2 second delay
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
