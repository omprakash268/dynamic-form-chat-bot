import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../../model/message.model';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-chat-messages',
  imports: [CommonModule,DynamicFormComponent],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
})
export class ChatMessagesComponent {
  
  @Input() messages: Message[] = [];
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}
