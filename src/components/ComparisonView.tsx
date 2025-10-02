import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessagePair } from './MessagePair';
import './ComparisonView.css';

interface ComparisonViewProps {
  messages: Message[];
  isLoading: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // agrupa mensagens em pares (user + assistant)
  const pairs: Array<{ user: Message; llm?: Message; rag?: Message }> = [];
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === 'user') {
      const llmMsg = messages[i + 1];
      const ragMsg = messages[i + 2];
      pairs.push({
        user: msg,
        llm: llmMsg?.role === 'assistant' && llmMsg.source === 'llm' ? llmMsg : undefined,
        rag: ragMsg?.role === 'assistant' && ragMsg.source === 'rag' ? ragMsg : undefined,
      });
      i += 2;
    }
  }

  // verifica se o último par está incompleto (ainda carregando)
  const lastPair = pairs[pairs.length - 1];
  const isLastPairLoading = isLoading && lastPair && (!lastPair.llm || !lastPair.rag);

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <div className="column-header llm-header">
          <h3>LLM</h3>
          <span className="column-subtitle">Sem contexto de documentos</span>
        </div>
        <div className="column-header rag-header">
          <h3>RAG (Retrieval Augmented Generation)</h3>
          <span className="column-subtitle">Com contexto de documentos</span>
        </div>
      </div>

      <div className="comparison-content">
        {pairs.map((pair, idx) => (
          <MessagePair 
            key={pair.user.id} 
            pair={pair} 
            isLoading={isLastPairLoading && idx === pairs.length - 1}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};