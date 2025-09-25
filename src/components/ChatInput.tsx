import React, { useState } from 'react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  onSendMessage: (useRAG?: boolean) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ inputMessage, setInputMessage, onSendMessage, isLoading }) => {
  const [useRAG, setUseRAG] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(useRAG);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <div className="mode-toggle">
        <button type="button" className={`mode-btn ${useRAG ? 'active' : ''}`} onClick={() => setUseRAG(true)} disabled={isLoading}>
          📚 RAG
        </button>
        <button type="button" className={`mode-btn ${!useRAG ? 'active' : ''}`} onClick={() => setUseRAG(false)} disabled={isLoading}>
          🤖 LLM
        </button>
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={isLoading}
        className="text-input"
      />
      <button type="submit" disabled={!inputMessage.trim() || isLoading} className="send-btn">
        Enviar
      </button>
    </form>
  );
};


