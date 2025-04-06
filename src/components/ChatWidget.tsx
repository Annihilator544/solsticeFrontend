import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Input } from './ui/input';
import { useTableData } from '@/store/use-table-data';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello I am your AI assistant 🤖. How can I help you today?"
    }
  ]);
  const { tableData } = useTableData();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // 1) Create a user message from the typed input only.
    const userMessage = { role: 'user', content: inputMessage };

    // 2) Add user message to the chat window.
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 3) Send the transaction data separately (not visible in the chat).
      const response = await fetch(
        "https://jcxcb4dknyi7kwjxmxce55rfyu0lybfb.lambda-url.eu-west-2.on.aws/", 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [userMessage],
            dataContext: tableData // or tableData.slice(15) if you only want partial data
          })
        }
      );

      const data = await response.json();

      // 4) Append the AI’s reply
      if (data.choices && data.choices.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.choices[0].message.content
          }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:opacity-90 text-primary-foreground p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground font-extralight rounded-t-lg">
            <h3 className="font-medium">AI ChatBot</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg"
              >
                <Send size={20} className="m-auto" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
