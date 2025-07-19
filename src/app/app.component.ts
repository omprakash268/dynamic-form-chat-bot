import { Component } from '@angular/core';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';

@Component({
  selector: 'app-root',
  imports: [ChatContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chat-bot-dynamic-form';
}
