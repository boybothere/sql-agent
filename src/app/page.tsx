'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import './Chat.css';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="header-icon">🗄️</span>
        <div className="header-text">
          <h1>SQL Assistant</h1>
          <p>Query your database with natural language</p>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🗄️</div>
            <h2>Start a conversation</h2>
            <p>Ask me anything about your database</p>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className="message-wrapper">
            <div className={`message-avatar ${message.role}`}>
              {message.role === 'user' ? '👤' : '🤖'}
            </div>

            <div className="message-content">
              <div className="message-role">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>

              {message.parts.map((part: any, i: number) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div key={`${message.id}-${i}`} className="message-text">
                        {part.text}
                      </div>
                    );

                  case 'tool-schema':
                    return (
                      <div key={`${message.id}-${i}`} className="tool-card schema">
                        <div className="tool-header">
                          <span className="tool-icon">🔍</span>
                          <span className="tool-title">Analyzing Schema</span>
                          {part.state === 'output-available' && <span className="tool-status">✓</span>}
                        </div>
                        {part.state === 'call' && (
                          <div className="tool-loading">
                            <span className="spinner">⏳</span>
                            <span>Fetching database schema...</span>
                          </div>
                        )}
                        {part.state === 'output-available' && part.output && (
                          <pre className="tool-output">{String(part.output)}</pre>
                        )}
                      </div>
                    );

                  case 'tool-db':
                    const hasQuery = part.input && typeof part.input === 'object' && 'query' in part.input;
                    const query = hasQuery ? (part.input as any).query : null;

                    return (
                      <div key={`${message.id}-${i}`} className="tool-card database">
                        <div className="tool-header">
                          <span className="tool-icon">💾</span>
                          <span className="tool-title">Database Query</span>
                          {part.state === 'output-available' && <span className="tool-status">✓</span>}
                        </div>

                        {query && (
                          <div className="query-section">
                            <div className="query-label">SQL Query:</div>
                            <pre className="query-code">{query}</pre>
                          </div>
                        )}

                        {part.state === 'call' && (
                          <div className="tool-loading">
                            <span className="spinner">⏳</span>
                            <span>Executing query...</span>
                          </div>
                        )}

                        {part.state === 'output-available' && part.output && (
                          <div className="results-section">
                            <div className="results-label">Results:</div>
                            <div className="results-content">
                              {typeof part.output === 'object' &&
                                part.output !== null &&
                                'columns' in part.output &&
                                'rows' in part.output &&
                                Array.isArray((part.output as any).columns) &&
                                Array.isArray((part.output as any).rows) ? (
                                <table className="results-table">
                                  <thead>
                                    <tr>
                                      {((part.output as any).columns as string[]).map((col: string, idx: number) => (
                                        <th key={idx}>{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {((part.output as any).rows as any[][]).map((row: any[], idx: number) => (
                                      <tr key={idx}>
                                        {row.map((cell: any, cellIdx: number) => (
                                          <td key={cellIdx}>{cell ?? 'NULL'}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <pre className="results-json">
                                  {JSON.stringify(part.output, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            placeholder="Ask about your database..."
            onChange={e => setInput(e.currentTarget.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
          >
            📤 Send
          </button>
        </div>
      </div>
    </div>
  );
}