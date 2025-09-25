import { useCallback, useState } from 'react';
import { Chat, Message } from '../types';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = useCallback((title?: string, initialMessage?: string) => {
    const id = `chat-${Date.now()}`;
    const now = new Date();
    const newChat: Chat = { id, title: title ?? 'Chat RAG FII', messages: [], createdAt: now, updatedAt: now };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(id);

    if (initialMessage && initialMessage.trim()) {
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: initialMessage,
        createdAt: new Date().toISOString(),
      };
      setChats((prev) => prev.map((c) => (c.id === id ? { ...c, messages: [...c.messages, userMsg] } : c)));

      (async () => {
        setIsLoading(true);
        try {
          await new Promise((r) => setTimeout(r, 800));
          const assistantText = 'Resposta simulada do assistente';

          const assistantMsg: Message = {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: assistantText,
            createdAt: new Date().toISOString(),
          };

          setChats((prev) =>
            prev.map((c) => (c.id === id ? { ...c, messages: [...c.messages, assistantMsg] } : c))
          );
        } catch (err) {
          console.error('createNewChat assistant fetch failed', err);
        } finally {
          setIsLoading(false);
        }
      })();
    }

    return id;
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (currentChatId === chatId) setCurrentChatId(null);
    },
    [currentChatId]
  );

  const getCurrentChat = useCallback(() => chats.find((c) => c.id === currentChatId), [chats, currentChatId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentChatId) return;
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };

      setChats((prev) => prev.map((c) => (c.id === currentChatId ? { ...c, messages: [...c.messages, userMsg] } : c)));
      setIsLoading(true);

      try {
        // Substitua por chamada real à API
        await new Promise((r) => setTimeout(r, 800));
        const assistantText = 'Resposta simulada do assistente';

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: assistantText,
          createdAt: new Date().toISOString(),
        };

        setChats((prev) =>
          prev.map((c) => (c.id === currentChatId ? { ...c, messages: [...c.messages, assistantMsg] } : c))
        );
      } catch (err) {
        console.error('sendMessage failed', err);
      } finally {
        setIsLoading(false);
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
}