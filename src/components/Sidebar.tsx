import React from 'react';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Chat } from '../types';
import './Sidebar.css';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          <Plus size={16} />
          Novo Chat
        </button>
      </div>
      
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare size={16} className="chat-icon" />
            <span className="chat-title">{chat.title}</span>
            <button
              className="delete-chat-button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
