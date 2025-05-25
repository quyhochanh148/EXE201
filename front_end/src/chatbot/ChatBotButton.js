import React, { useState, useEffect } from 'react';
import { MessageCircle, X, BotMessageSquare } from 'lucide-react';

const ChatBotButton = ({ isOpen, toggleChat }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const messages = localStorage.getItem('chatMessages');
      if (messages) {
        const parsedMessages = JSON.parse(messages);
        const lastOpenTime = localStorage.getItem('lastChatOpenTime');
        const unreadMessages = parsedMessages.filter(
          msg => msg.sender === 'bot' && (!lastOpenTime || new Date(msg.time) > new Date(lastOpenTime))
        );
        setUnreadCount(unreadMessages.length);
        if (unreadMessages.length > 0) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 2000);
        }
      }
    } else {
      setUnreadCount(0);
      localStorage.setItem('lastChatOpenTime', new Date().toISOString());
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2E7D32] hover:bg-[#2E7D32]'} text-white flex items-center justify-center shadow-lg transition-colors z-[5000] ${isAnimating ? 'animate-bounce' : ''}`}
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? <X size={24} /> : <BotMessageSquare size={24} />}
      </button>
      
      {!isOpen && unreadCount > 0 && (
        <div className="absolute top-0 right-6 transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-[5000]">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default ChatBotButton;