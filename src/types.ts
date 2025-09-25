export type Message = {
  id: string;
  content: string;
  createdAt: String;
  role: 'user' | 'assistant';
  isUser?: boolean;
  timestamp?: Date;
};

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface APIResponse {
  answer: string;
}
