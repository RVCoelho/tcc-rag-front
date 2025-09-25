import React from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const {
    chats,
    currentChatId,
    isLoading,
    createNewChat,
    selectChat,
    sendMessage,
    getCurrentChat,
    deleteChat,
  } = useChat();

  const handleSendMessage = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={() => createNewChat()}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
      />
      <ChatArea
        currentChat={getCurrentChat()}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onCreateChat={createNewChat}
      />
    </div>
  );
}

export default App;
