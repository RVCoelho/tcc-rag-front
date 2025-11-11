import React from 'react';
import { ChatArea } from './components/ChatArea';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const {
    isLoading,
    createNewChat,
    sendMessage,
    getCurrentChat,
  } = useChat();

  const handleSendMessage = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div className="app">
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
