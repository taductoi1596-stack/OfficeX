import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { IconSend, IconBot, IconUser } from '@officex/icons';
import { aiGateway } from '@officex/ai-core';
import '@officex/theme/dist/index.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ipc = (window as any).ipc;

const App = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Chào bạn! Tôi là OfficeX AI Assistant. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await aiGateway.generateText(userMsg.text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Xin lỗi, đã xảy ra lỗi kết nối.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const closeWindow = () => ipc?.invoke('window-close');
  const minimizeWindow = () => ipc?.invoke('window-minimize');
  const maximizeWindow = () => ipc?.invoke('window-maximize');

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Title Bar */}
      <div className="h-8 bg-purple-600 text-white flex items-center px-2 shadow-sm shrink-0" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-2">
          <IconBot size={16} />
          <span className="text-xs font-semibold">OfficeX AI Assistant</span>
        </div>
        
        <div className="ml-auto flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button className="h-8 w-10 hover:bg-white/20 flex items-center justify-center transition-colors" onClick={minimizeWindow}>—</button>
          <button className="h-8 w-10 hover:bg-white/20 flex items-center justify-center transition-colors" onClick={maximizeWindow}>□</button>
          <button className="h-8 w-10 hover:bg-red-500 flex items-center justify-center transition-colors" onClick={closeWindow}>✕</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-neutral-900" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
              {msg.sender === 'user' ? <IconUser size={16} /> : <IconBot size={16} />}
            </div>
            <div className={`p-3 rounded-lg shadow-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-neutral-800 border border-border rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <IconBot size={16} />
            </div>
            <div className="p-4 rounded-lg shadow-sm bg-white dark:bg-neutral-800 border border-border rounded-tl-none flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border shrink-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-background border border-input rounded-full p-1 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none py-2 text-sm"
            placeholder="Ask AI anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full w-10 h-10 p-0 bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
          >
            <IconSend size={16} />
          </Button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-muted-foreground">AI can make mistakes. Consider verifying important information.</span>
        </div>
      </div>
    </div>
  );
};

export default App;
