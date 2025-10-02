import { useState, useCallback } from 'react';
import { Chat, Message } from '../types';
import { apiService } from '../services/api';
import { getLanguageInstruction } from '../services/languageService';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const buildRequest = (text: string) => {
    const instruction = getLanguageInstruction();
    return `${text}\n\n${instruction}`;
  };

  const createNewChat = useCallback((title?: string, initialMessage?: string) => {
    const now = new Date();
    const newChat: Chat = {
      id: generateId(),
      title: title && title.trim() ? title.trim() : 'Novo Chat',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);

    if (initialMessage && initialMessage.trim()) {
      const userMessage: Message = {
        id: generateId(),
        content: initialMessage,
        isUser: true,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        role: 'user',
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === newChat.id ? { ...chat, messages: [userMessage], updatedAt: new Date() } : chat
        )
      );

      (async () => {
        setIsLoading(true);

        // chama LLM e RAG em paralelo
        const [llmResult, ragResult] = await Promise.allSettled([
          apiService.queryLLM(buildRequest(initialMessage)),
          apiService.queryRAG(buildRequest(initialMessage)),
        ]);

        const llmMessage: Message = {
          id: generateId(),
          content: llmResult.status === 'fulfilled' ? llmResult.value : 'Erro ao obter resposta da LLM',
          isUser: false,
          timestamp: new Date(),
          createdAt: new Date().toISOString(),
          role: 'assistant',
          source: 'llm',
        };

        const ragMessage: Message = {
          id: generateId(),
          content: ragResult.status === 'fulfilled' ? ragResult.value : 'Erro ao obter resposta do RAG',
          isUser: false,
          timestamp: new Date(),
          createdAt: new Date().toISOString(),
          role: 'assistant',
          source: 'rag',
        };

        setChats(prev =>
          prev.map(chat =>
            chat.id === newChat.id
              ? { ...chat, messages: [userMessage, llmMessage, ragMessage], updatedAt: new Date() }
              : chat
          )
        );

        setIsLoading(false);
      })();
    }

    return newChat.id;
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentChatId) return;

      const userMessage: Message = {
        id: generateId(),
        content,
        isUser: true,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        role: 'user',
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                updatedAt: new Date(),
                title:
                  chat.messages.length === 0
                    ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
                    : chat.title,
              }
            : chat
        )
      );

      setIsLoading(true);

      const [llmResult, ragResult] = await Promise.allSettled([
        apiService.queryLLM(buildRequest(content)),
        apiService.queryRAG(buildRequest(content)),
      ]);

      const llmMessage: Message = {
        id: generateId(),
        content: llmResult.status === 'fulfilled' ? llmResult.value : 'Erro ao obter resposta da LLM',
        isUser: false,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        role: 'assistant',
        source: 'llm',
      };

      const ragMessage: Message = {
        id: generateId(),
        content: ragResult.status === 'fulfilled' ? ragResult.value : 'Erro ao obter resposta do RAG',
        isUser: false,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        role: 'assistant',
        source: 'rag',
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, llmMessage, ragMessage],
                updatedAt: new Date(),
              }
            : chat
        )
      );

      setIsLoading(false);
    },
    [currentChatId]
  );

  const getCurrentChat = useCallback(() => {
    return chats.find(chat => chat.id === currentChatId);
  }, [chats, currentChatId]);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
    },
    [currentChatId]
  );

  return {
    chats,
    currentChatId,
    isLoading,
    createNewChat,
    selectChat,
    sendMessage,
    getCurrentChat,
    deleteChat,
  };
};
