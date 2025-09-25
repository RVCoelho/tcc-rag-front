import React from 'react';
import { Message as MessageType } from '../types';
import { User, Bot } from 'lucide-react';
import './Message.css';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`message ${message.isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-avatar">
        {message.isUser ? (
          <User size={20} />
        ) : (
          <Bot size={20} />
        )}
      </div>
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        <div className="message-timestamp">
          {message.timestamp
            ? message.timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })
            : ''}
        </div>
      </div>
    </div>
  );
};
