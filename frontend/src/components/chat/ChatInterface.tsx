import { useState } from 'react';

export function ChatInterface() {
  const [messages] = useState<Array<{ id: string; role: string; content: string }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to help you find the perfect ESRI application for your needs. Tell me what you\'re trying to accomplish, and I\'ll recommend the best apps for your use case.',
    },
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-esri-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form className="flex gap-2">
          <input
            type="text"
            placeholder="Describe what you want to build..."
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
          Example: "I need to visualize crime data by neighborhood"
        </p>
      </div>
    </div>
  );
}
