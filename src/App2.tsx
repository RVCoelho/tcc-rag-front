import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Message, MessagesList } from './components/Messages';
import { ChatInput } from './components/ChatInput';
import { apiService } from './services/api';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou seu assistente de RAG. Posso responder perguntas de duas formas:\n\n📚 **RAG**: Respostas baseadas nos documentos indexados\n🤖 **LLM**: Respostas do modelo de linguagem apenas\n\nComo posso te ajudar?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const isHealthy = await apiService.checkHealth();
      setConnectionStatus(isHealthy ? 'connected' : 'disconnected');
      console.log('Connection status:', isHealthy ? 'connected' : 'disconnected');
    } catch {
      setConnectionStatus('disconnected');
      console.log('Connection status:', 'disconnected');
    }
  };

  const sendMessage = async (useRAG: boolean = true) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      let answer: string;
      console.log(`[Chat] Enviando pergunta (${useRAG ? 'RAG' : 'LLM'}):`, currentQuestion);
      if (useRAG) {
        answer = await apiService.queryRAG(currentQuestion);
      } else {
        answer = await apiService.queryLLM(currentQuestion);
      }
      console.log(`[Chat] Resposta recebida (${useRAG ? 'RAG' : 'LLM'}).`);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
        type: useRAG ? 'rag' : 'llm'
      };

      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('connected');
    } catch (error) {
      console.error(`[Chat] Erro ao processar (${useRAG ? 'RAG' : 'LLM'})`, error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `Erro ao processar sua pergunta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: 'Chat limpo! Como posso te ajudar?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>RAG Assistant</h1>
          <p>Sistema de Retrieval Augmented Generation</p>
          <div className="connection-status">
            <span className={`status-indicator ${connectionStatus}`}>
              {connectionStatus === 'connected' && '🟢 Conectado'}
              {connectionStatus === 'disconnected' && '🔴 Desconectado'}
              {connectionStatus === 'checking' && '🟡 Verificando...'}
            </span>
            {connectionStatus === 'disconnected' && (
              <button onClick={checkConnection} className="retry-button">
                🔄 Tentar novamente
              </button>
            )}
            <button onClick={clearChat} className="clear-button" title="Limpar chat">
              🗑️
            </button>
          </div>
        </div>
      </header>
      
      <main className="chat-container">
        <MessagesList 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
        
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
