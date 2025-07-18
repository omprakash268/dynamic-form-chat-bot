import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  messageText: string = '';
  isDisabled: boolean = false;

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessageItem();
    }
  }

  sendMessageItem(): void {
    if (this.messageText.trim() && !this.isDisabled) {
      this.isDisabled = true;
      this.sendMessage.emit(this.messageText.trim());
      this.messageText = '';

      // Re-enable after a short delay
      setTimeout(() => {
        this.isDisabled = false;
        this.messageInput.nativeElement.focus();
      }, 1000);
    }
  }
}
