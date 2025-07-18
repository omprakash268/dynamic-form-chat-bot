import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Message } from '../../../model/message.model';
import { ChatService } from '../../../service/chat.service';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';



@Component({
  selector: 'app-chat-container',
  imports: [ChatHeaderComponent,ChatMessagesComponent,ChatInputComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss',
})
export class ChatContainerComponent {
  messages: Message[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSendMessage(message: string): void {
    if (message.trim()) {
      this.chatService.sendMessage(message);
    }
  }
}
