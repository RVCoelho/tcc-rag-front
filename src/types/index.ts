export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  source?: 'llm' | 'rag' | 'method3'; // identifica qual método gerou a resposta
  isUser?: boolean;
  timestamp?: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}