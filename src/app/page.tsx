'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  // This is the corrected line:
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`p-3 rounded-2xl shadow-md ${message.role === 'user'
                  ? 'bg-blue-600 rounded-br-none'
                  : 'bg-zinc-800 rounded-bl-none'
                } max-w-lg`}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="whitespace-pre-wrap"
                      >
                        {part.text}
                      </div>
                    );
                  case 'tool-schema':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="flex items-center gap-2.5 text-sm my-2 p-3 bg-zinc-700/80 rounded-lg border border-zinc-600"
                      >
                        <span className="text-lg">🔍</span>
                        <span className="font-mono font-medium text-zinc-300">
                          Analyzing schema...
                        </span>
                      </div>
                    );
                  case 'tool-db':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="flex items-center gap-2.5 text-sm my-2 p-3 bg-zinc-700/80 rounded-lg border border-zinc-600"
                      >
                        <span className="text-lg">💾</span>
                        <span className="font-mono font-medium text-zinc-300">
                          Executing database query...
                        </span>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-700">
        <form
          className="max-w-md mx-auto"
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput('');
          }}
        >
          <input
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={input}
            placeholder="Say something..."
            onChange={e => setInput(e.currentTarget.value)}
          />
        </form>
      </div>
    </div>
  );
}