'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI therapy assistant. I'm here to provide support and guidance based on your musical mood patterns. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          message: inputValue, 
          conversationHistory 
        }),
      });

      const data = await response.json();

      // Remove typing indicator and add response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          sender: 'ai',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full sm:w-96 h-[600px] bg-[#121212] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#282828]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#282828] bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="bg-[#1db954] p-2 rounded-full">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Therapy Assistant</h3>
              <p className="text-xs spotify-text-light">Your emotional wellness guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="spotify-text-light hover:text-white transition-colors p-1 rounded-lg hover:bg-[#282828]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-[#1db954]' 
                    : 'bg-[#282828]'
                }`}>
                  {message.sender === 'user' ? 
                    <User className="w-4 h-4 text-black" /> : 
                    <Bot className="w-4 h-4 text-white" />
                  }
                </div>
                <div className={`rounded-xl p-3 ${
                  message.sender === 'user'
                    ? 'bg-[#1db954] text-black'
                    : 'bg-[#282828] text-white'
                }`}>
                  {message.isTyping ? (
                    <div className="flex gap-1 py-1">
                      <div className="w-2 h-2 bg-[#b3b3b3] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#b3b3b3] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#b3b3b3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#282828] bg-[#181818]">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts or ask for guidance..."
              className="flex-1 bg-[#282828] border border-[#3e3e3e] rounded-full px-4 py-2 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-[#1db954] text-black p-2 rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
