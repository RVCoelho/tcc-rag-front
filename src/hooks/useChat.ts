import { useState, useCallback } from 'react';
import { Chat, Message } from '../types';
import { getLanguageInstruction } from '../services/languageService';
import { apiService } from '../services/api';

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

    const contextMessage: Message = {
      id: generateId(),
      content:
        'Contexto: este assistente possui informações e contexto sobre diversos fundos de investimento (rendimentos, vacância, inadimplência, VPC, pipeline de aquisições/desinvestimentos, cronograma de contratos, alavancagem, entre outros) e usará esse contexto para formular respostas relevantes.',
      isUser: false,
      timestamp: now,
      createdAt: now.toISOString(),
      role: 'assistant',
    };

    setChats(prev => [{ ...newChat, messages: [contextMessage] }, ...prev]);
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
          chat.id === newChat.id ? { ...chat, messages: [...chat.messages, userMessage], updatedAt: new Date() } : chat
        )
      );

      (async () => {
        setIsLoading(true);
        try {
          let response: string | null = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              response = await apiService.queryRAG(buildRequest(initialMessage));
              break;
            } catch (err) {
              if (attempt === 1) throw err;
            }
          }

          const assistantMessage: Message = {
            id: generateId(),
            content: response ?? '',
            isUser: false,
            timestamp: new Date(),
            createdAt: new Date().toISOString(),
            role: 'assistant',
          };

          setChats(prev =>
            prev.map(chat =>
              chat.id === newChat.id ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date() } : chat
            )
          );
        } catch (err) {
          const errorMessage: Message = {
            id: generateId(),
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
            isUser: false,
            timestamp: new Date(),
            createdAt: new Date().toISOString(),
            role: 'assistant',
          };
          setChats(prev =>
            prev.map(chat =>
              chat.id === newChat.id ? { ...chat, messages: [...chat.messages, errorMessage], updatedAt: new Date() } : chat
            )
          );
        } finally {
          setIsLoading(false);
        }
      })();
    }

    return newChat.id;
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
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
              title: chat.messages.length === 0
                ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
                : chat.title,
            }
          : chat
      )
    );

    setIsLoading(true);

    try {
      let response: string | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await apiService.queryRAG(buildRequest(content));
          break;
        } catch (err) {
          if (attempt === 1) throw err;
        }
      }

      const assistantMessage: Message = {
        id: generateId(),
        content: response ?? '',
        isUser: false,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        role: 'assistant',
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : chat
        )
      );
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        isUser: false,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        role: 'assistant',
      };

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
                updatedAt: new Date(),
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId]);

  const getCurrentChat = useCallback(() => {
    return chats.find(chat => chat.id === currentChatId);
  }, [chats, currentChatId]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  }, [currentChatId]);

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
