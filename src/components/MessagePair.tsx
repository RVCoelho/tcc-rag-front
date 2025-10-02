import React from 'react';
import { Message as MessageType } from '../types';
import { User, Bot, AlertCircle, Loader2 } from 'lucide-react';
import './MessagePair.css';

interface MessagePairProps {
  pair: {
    user: MessageType;
    llm?: MessageType;
    rag?: MessageType;
  };
  isLoading?: boolean;
}

export const MessagePair: React.FC<MessagePairProps> = ({ pair, isLoading = false }) => {
  return (
    <div className="message-pair">
      <div className="user-question">
        <div className="message-avatar user-avatar">
          <User size={16} />
        </div>
        <div className="message-content">
          <p>{pair.user.content}</p>
        </div>
      </div>

      <div className="responses-row">
        <div className="response-column llm-column">
          {isLoading && !pair.llm ? (
            <div className="response-card loading-card">
              <div className="response-header">
                <Loader2 size={16} className="animate-spin" />
                <span>Processando LLM...</span>
              </div>
              <div className="response-content loading-placeholder">
                Aguardando resposta...
              </div>
            </div>
          ) : pair.llm ? (
            <div className="response-card">
              <div className="response-header">
                <Bot size={16} />
                <span>LLM</span>
              </div>
              <div className="response-content">
                {pair.llm.content}
              </div>
            </div>
          ) : (
            <div className="response-card error-card">
              <div className="response-header">
                <AlertCircle size={16} />
                <span>Erro</span>
              </div>
              <div className="response-content">
                Falha ao obter resposta da LLM
              </div>
            </div>
          )}
        </div>

        <div className="response-column rag-column">
          {isLoading && !pair.rag ? (
            <div className="response-card loading-card">
              <div className="response-header">
                <Loader2 size={16} className="animate-spin" />
                <span>Processando RAG...</span>
              </div>
              <div className="response-content loading-placeholder">
                Aguardando resposta...
              </div>
            </div>
          ) : pair.rag ? (
            <div className="response-card">
              <div className="response-header">
                <Bot size={16} />
                <span>RAG</span>
              </div>
              <div className="response-content">
                {pair.rag.content}
              </div>
            </div>
          ) : (
            <div className="response-card error-card">
              <div className="response-header">
                <AlertCircle size={16} />
                <span>Erro</span>
              </div>
              <div className="response-content">
                Falha ao obter resposta do RAG
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};