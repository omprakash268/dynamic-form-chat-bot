export interface Message {
  id: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  response: {
    type: string;
    text: string;
    formConfig: any;
  };
}
