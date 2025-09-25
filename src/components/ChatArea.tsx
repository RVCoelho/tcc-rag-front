import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Chat } from '../types';
import { Message } from './Message';
import { InputArea } from './InputArea';
import { WelcomePanel } from './WelcomePanel';
import './ChatArea.css';

interface ChatAreaProps {
  currentChat: Chat | undefined;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onCreateChat: (title?: string) => string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  isLoading,
  onSendMessage,
  onCreateChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const topSpacerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  useEffect(() => {
    const adjustTopSpacer = () => {
      if (!containerRef.current || !topSpacerRef.current) return;
      const container = containerRef.current;
      const inputPaddingBottom = 100;
      const availableHeight = container.clientHeight - inputPaddingBottom;
      const contentHeight = container.scrollHeight - inputPaddingBottom;

      const desiredMaxMargin = 48;
      let spacer = 0;
      if (contentHeight < availableHeight) {
        const remaining = availableHeight - contentHeight;
        spacer = Math.min(desiredMaxMargin, remaining);
      } else {
        spacer = 0;
      }
      topSpacerRef.current.style.height = `${spacer}px`;
    };

    adjustTopSpacer();
    const handleResize = () => adjustTopSpacer();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentChat?.messages, isLoading]);

  if (!currentChat) {
    return (
      <div className="chat-area">
        <WelcomePanel onCreateChat={onCreateChat} />
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="messages-container" ref={containerRef}>
        {currentChat.messages.length === 0 ? (
          <WelcomePanel onSendMessage={onSendMessage} isLoading={isLoading} />
        ) : (
          <>
            <div ref={topSpacerRef} />
            {currentChat.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </>
        )}
        
        {isLoading && (
          <div className="loading-message">
            <div className="message assistant-message">
              <div className="message-avatar">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="message-content">
                <div className="message-text">
                  Pensando...
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {currentChat && currentChat.messages.length > 0 && (
        <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
      )}
    </div>
  );
};
