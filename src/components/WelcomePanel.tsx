import React, { useMemo, useState, useRef } from 'react';
import { InputArea } from './InputArea';
import './ChatArea.css';

interface WelcomePanelProps {
  onCreateChat?: (title?: string, initialMessage?: string) => string;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const WelcomePanel: React.FC<WelcomePanelProps> = ({
  onCreateChat,
  onSendMessage,
  isLoading = false,
}) => {
  const examples = useMemo(
    () => [
      'Qual foi o dividend yield e o rendimento distribuído no mês?',
      'Como está a taxa de vacância e a inadimplência do portfólio?',
      'Qual o valor patrimonial por cota (VPC) e a variação no período?',
      'Há pipeline de aquisições/desinvestimentos e comentários da gestão?',
      'Como está o cronograma de vencimento dos contratos e a alavancagem?',
    ],
    []
  );

  const [currentText, setCurrentText] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const isCustom = currentText !== '' && !examples.includes(currentText);

  const handleExampleClick = (ex: string) => {
    if (isCustom) return;
    if (currentText === ex) {
      inputRef.current?.focus();
      return;
    }
    setCurrentText(ex);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1>Chat RAG FII</h1>

        <p className="welcome-context">
          Olá! Sou seu assistente de RAG (Retrieval Augmented Generation). Tenho contexto sobre diversos fundos de investimento — rendimentos, vacância, inadimplência, VPC, pipeline de aquisições/desinvestimentos, cronograma de contratos, alavancagem, entre outros — e uso esse contexto para formular respostas relevantes. Faça uma pergunta e eu buscarei informações úteis para te ajudar!
        </p>
            {/* TO-DO: adicionar opção de visualizar os fundos (precisa de endpoint do back) */}
        <div className="example-questions">
          <p>Exemplos de perguntas que você pode fazer:</p>
          <ul>
            {examples.map((ex) => {
              const selected = currentText === ex;
              return (
                <li
                  key={ex}
                  className={`${selected ? 'selected' : ''} ${isCustom ? 'disabled' : ''}`}
                  onClick={() => {
                    if (isCustom) return;
                    handleExampleClick(ex);
                  }}
                  role="button"
                  aria-disabled={isCustom}
                >
                  {ex}
                </li>
              );
            })}
          </ul>
        </div>

        {onCreateChat && !onSendMessage && (
          <InputArea
            onCreateChat={onCreateChat}
            value={currentText}
            onChange={(v) => setCurrentText(v)}
            placeholder="Digite o título do novo chat..."
            inputRef={inputRef}
          />
        )}
        {onSendMessage && !onCreateChat && (
          <InputArea
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            value={currentText}
            onChange={(v) => setCurrentText(v)}
            placeholder="Digite sua mensagem..."
            inputRef={inputRef}
          />
        )}
      </div>
    </div>
  );
};