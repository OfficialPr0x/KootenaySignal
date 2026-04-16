'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Bot, User, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export default function AdvisorChat({ initialMessages, businessName }: { initialMessages: Message[]; businessName: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q');
  const sentInitial = useRef(false);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQ && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    const aiId = `ai-${Date.now()}`;

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/sites/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong.' }));
        setMessages(prev => [...prev, {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: data.error || 'Something went wrong. Try again.',
          created_at: new Date().toISOString(),
        }]);
        setLoading(false);
        return;
      }

      const contentType = res.headers.get('content-type') || '';

      // Handle streaming SSE response
      if (contentType.includes('text/event-stream') && res.body) {
        // Add empty assistant message to stream into
        setMessages(prev => [...prev, {
          id: aiId,
          role: 'assistant',
          content: '',
          created_at: new Date().toISOString(),
        }]);
        setStreamingId(aiId);
        setLoading(false);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(l => l.trim().startsWith('data:'));

          for (const line of lines) {
            const data = line.replace(/^data:\s*/, '');
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setMessages(prev =>
                  prev.map(m =>
                    m.id === aiId ? { ...m, content: m.content + parsed.content } : m
                  )
                );
              }
            } catch {
              // skip malformed
            }
          }
        }

        setStreamingId(null);
      } else {
        // Handle non-streaming JSON fallback
        const data = await res.json();
        setMessages(prev => [...prev, {
          id: aiId,
          role: 'assistant',
          content: data.reply,
          created_at: new Date().toISOString(),
        }]);
        setLoading(false);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Connection error. Please try again.',
        created_at: new Date().toISOString(),
      }]);
      setLoading(false);
    } finally {
      inputRef.current?.focus();
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const suggestions = [
    "How can I get more calls?",
    "What should I fix first?",
    "How do I get more Google reviews?",
    "Why isn't my site showing up on Google?",
    "What are my competitors doing better?",
    "How can I improve my website speed?",
  ];

  return (
    <div className="advisor-wrap">
      <div className="dash-topbar">
        <div>
          <h1 className="dash-page-title">AI Advisor</h1>
          <p className="dash-page-sub">Ask anything about {businessName}&apos;s online presence</p>
        </div>
      </div>

      <div className="advisor-chat">
        <div className="advisor-messages">
          {messages.length === 0 && (
            <div className="advisor-welcome">
              <Bot size={40} />
              <h3>Hey! I&apos;m your Signal Advisor.</h3>
              <p>I know your website, your scores, and your competition. Ask me anything about growing {businessName} online.</p>
              <div className="advisor-suggestion-grid">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="advisor-suggestion-btn"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`advisor-msg advisor-msg--${msg.role}`}>
              <div className="advisor-msg-avatar">
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="advisor-msg-content">
                {msg.role === 'assistant' ? (
                  <div className={`advisor-msg-text advisor-md${streamingId === msg.id ? ' advisor-streaming' : ''}`}>
                    <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="advisor-msg-text">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="advisor-msg advisor-msg--assistant">
              <div className="advisor-msg-avatar"><Bot size={16} /></div>
              <div className="advisor-msg-content">
                <div className="advisor-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="advisor-input-wrap">
          <textarea
            ref={inputRef}
            className="advisor-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your business..."
            rows={1}
            disabled={loading || streamingId !== null}
          />
          <button
            type="submit"
            className="advisor-send"
            disabled={loading || streamingId !== null || !input.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
