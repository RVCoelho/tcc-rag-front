import React from 'react';

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'rag' | 'llm';
};

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="messages-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
          <div className="message-bubble">
            <div className="message-text">{msg.text}</div>
            <div className="message-meta">
              <span className="message-sender">{msg.sender === 'user' ? 'Você' : 'Assistente'}</span>
              <span className="message-time">{msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              {msg.type && <span className="message-type">{msg.type.toUpperCase()}</span>}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="message-row bot">
          <div className="message-bubble">
            <div className="message-text">Pensando...</div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};


