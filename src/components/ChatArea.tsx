import React, { useRef, useEffect } from 'react';
import { Chat } from '../types';
import { InputArea } from './InputArea';
import { WelcomePanel } from './WelcomePanel';
import { ComparisonView } from './ComparisonView';
import './ChatArea.css';

interface ChatAreaProps {
  currentChat: Chat | undefined;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onCreateChat: (title?: string, initialMessage?: string) => string;
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
      {currentChat.messages.length === 0 ? (
        <WelcomePanel onSendMessage={onSendMessage} isLoading={isLoading} />
      ) : (
        <ComparisonView messages={currentChat.messages} isLoading={isLoading} />
      )}

      {currentChat && currentChat.messages.length > 0 && (
        <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
      )}
    </div>
  );
};
