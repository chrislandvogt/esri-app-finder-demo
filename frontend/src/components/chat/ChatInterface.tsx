import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { mockChatResponses, mockApps, mockDatasets } from '../../data/mockData';
import type { ChatMessage } from '../../types';

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'assistant',
    content: "Hello! I'm here to help you find the perfect ESRI application for your needs. Tell me what you're trying to accomplish, and I'll recommend the best apps and datasets from Living Atlas.",
    timestamp: new Date(),
  }]);
  const setSelectedApp = useAppStore((state) => state.setSelectedApp);
  const addDataset = useAppStore((state) => state.addDataset);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    
    const mockResponse = mockChatResponses.find(r => 
      message.toLowerCase().includes(r.query)
    ) || mockChatResponses[0];
    
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponse.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (mockResponse.recommendedApps.length > 0) {
        const app = mockApps.find(a => a.id === mockResponse.recommendedApps[0]);
        if (app) setSelectedApp(app);
      }
      
      if (mockResponse.suggestedDatasets.length > 0) {
        mockResponse.suggestedDatasets.forEach(datasetId => {
          const dataset = mockDatasets.find(d => d.id === datasetId);
          if (dataset) addDataset(dataset);
        });
      }
    }, 500);
    
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-esri-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Describe what you want to build..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esri-blue-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-esri-blue-600 text-white rounded-lg hover:bg-esri-blue-700 transition-colors font-medium"
          >
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Try: "visualize population" or "tell a story"
        </p>
      </div>
    </div>
  );
}
