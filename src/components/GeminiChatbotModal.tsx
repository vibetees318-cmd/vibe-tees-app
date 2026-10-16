import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Zap,
  Cpu,
  Package,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { User, Order } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  latestOrder?: Order | null;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  latestOrder,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hey! I'm VibeBot, your AI streetwear concierge. Need help tracking an order, checking fabric specs (280 GSM cotton / 450 GSM hoodies), or learning how to make ₹400-₹600 margins reselling on WhatsApp? Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskComplexity, setTaskComplexity] = useState<'fast' | 'general' | 'complex'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '📦 Track my order', text: latestOrder ? `Track my order #${latestOrder.orderID}` : 'How do I track my active order?' },
    { label: '🔥 What is 280 GSM?', text: 'Explain the difference between 280 GSM heavyweight cotton and regular t-shirts.' },
    { label: '💼 How reselling works', text: 'How do I add my profit margin and resell on WhatsApp without inventory?' },
    { label: '📋 GST vs Enrolment ID', text: 'Can I become a supplier on Vibe Tees without having a GST number?' },
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      // Context data for personalization
      const contextData = {
        userName: currentUser?.fullName || 'Guest',
        userRole: currentUser?.role || 'Customer',
        userMode: currentUser?.mode || 'Customer',
        latestOrderId: latestOrder?.orderID || null,
        latestOrderStatus: latestOrder?.orderStatus || null,
        resellerVerified: currentUser?.isResellerVerified || false,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          taskComplexity,
          contextData,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            modelUsed: data.modelUsed || 'gemini-3.8-flash',
          },
        ]);
      } else {
        throw new Error(data.error || 'No response from assistant');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          role: 'assistant',
          content:
            "I'm experiencing a brief network hiccup, but I'm still here to help! For immediate queries, feel free to email our founder at vibetees318@gmail.com or ask about your order tracking.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'gemini-3.8-flash',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-[90vh] max-h-[700px] rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-display font-black text-white uppercase tracking-wider">
                  VIBEBOT SUPPORT
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-zinc-400">
                Powered by Gemini • Live Order &amp; Reseller Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Complexity Selector */}
            <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-[9px] font-mono">
              <button
                type="button"
                onClick={() => setTaskComplexity('fast')}
                title="gemini-3.1-flash-lite: Fast responses"
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  taskComplexity === 'fast'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Fast
              </button>
              <button
                type="button"
                onClick={() => setTaskComplexity('general')}
                title="gemini-3.8-flash: General tasks"
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  taskComplexity === 'general'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Flash
              </button>
              <button
                type="button"
                onClick={() => setTaskComplexity('complex')}
                title="gemini-4-argon: Complex reasoning"
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  taskComplexity === 'complex'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Argon
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-zinc-950/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-sm shadow-md'
                        : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && !isUser && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400/80">{msg.modelUsed}</span>
                      </>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs py-2 px-1">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-[11px]">
                VibeBot is thinking with {taskComplexity === 'complex' ? 'gemini-4-argon' : taskComplexity === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash'}...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2 border-t border-zinc-900 bg-zinc-950 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp.text)}
              className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 whitespace-nowrap transition-all active:scale-95"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, GSM fabrics, or WhatsApp reselling..."
              className="flex-1 h-10 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 flex items-center justify-center transition-all active:scale-95 shadow-md shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
