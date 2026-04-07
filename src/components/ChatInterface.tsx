import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, GraduationCap, MessageSquare, Loader2, User, Bot, Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string, mode: 'study' | 'chat', images?: string[]) => Promise<void>;
  isGenerating: boolean;
  mode: 'study' | 'chat';
  setMode: (mode: 'study' | 'chat') => void;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  mode,
  setMode
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && images.length === 0) || isGenerating) return;

    const currentInput = input;
    const currentImages = [...images];
    
    setInput('');
    setImages([]);
    
    await onSendMessage(currentInput, mode, currentImages);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col bg-bg-primary text-text-primary h-screen overflow-hidden relative">
      {/* Header */}
      <header className="p-4 border-b border-border-primary flex items-center justify-between bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            mode === 'study' ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"
          )}>
            {mode === 'study' ? <GraduationCap size={20} /> : <MessageSquare size={20} />}
          </div>
          <div>
            <h2 className="font-semibold text-sm">{mode === 'study' ? 'Study Mode' : 'Chat Mode'}</h2>
            <p className="text-xs text-text-secondary">{mode === 'study' ? 'Generating detailed exam notes' : 'Conversational AI Assistant'}</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-border-primary">
          <button
            onClick={() => setMode('chat')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
              mode === 'chat' ? "bg-bg-tertiary text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('study')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
              mode === 'study' ? "bg-bg-tertiary text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Study
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-border-primary">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20"
            >
              <Bot size={32} className="text-white" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">How can I help you today?</h1>
              <p className="text-text-secondary">I can help you study for exams, explain complex topics, or just chat about anything.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-8">
              {[
                { icon: <GraduationCap size={18} />, title: "Study Mode", desc: "Upload notes or paste text for detailed exam notes." },
                { icon: <MessageSquare size={18} />, title: "Chat Mode", desc: "Ask questions, solve problems, or brainstorm ideas." }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setMode(item.title.toLowerCase().includes('study') ? 'study' : 'chat')}
                  className="p-4 bg-bg-secondary border border-border-primary rounded-2xl text-left hover:bg-bg-tertiary transition-colors group"
                >
                  <div className="mb-2 text-text-secondary group-hover:text-blue-400 transition-colors">{item.icon}</div>
                  <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-4xl mx-auto",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === 'user' ? "bg-bg-tertiary" : "bg-blue-600"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "flex flex-col space-y-2 max-w-[85%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' ? "bg-bg-tertiary text-text-primary" : "bg-bg-secondary text-text-primary border border-border-primary"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                <span className="text-[10px] text-text-secondary px-1">
                  {new Date(msg.createdAt?.seconds * 1000 || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))
        )}
        {isGenerating && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot size={16} />
            </div>
            <div className="bg-bg-secondary border border-border-primary px-4 py-3 rounded-2xl flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-blue-500" />
              <span className="text-xs text-text-secondary">Akash.ai is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-primary/80 backdrop-blur-md border-t border-border-primary">
        <div className="max-w-4xl mx-auto relative">
          {/* Image Previews */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex gap-2 mb-3 overflow-x-auto pb-2"
              >
                {images.map((img, i) => (
                  <div key={i} className="relative group flex-shrink-0">
                    <img src={img} alt="Upload" className="w-20 h-20 object-cover rounded-xl border border-border-primary" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={mode === 'study' ? "Paste notes or upload images for exam-ready content..." : "Ask me anything..."}
              className="w-full bg-bg-secondary border border-border-primary rounded-2xl px-4 py-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all resize-none min-h-[60px] max-h-[200px] text-text-primary"
              rows={1}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all"
                title="Upload Images"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="submit"
                disabled={(!input.trim() && images.length === 0) || isGenerating}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  (!input.trim() && images.length === 0) || isGenerating
                    ? "text-text-secondary cursor-not-allowed"
                    : "text-blue-500 hover:bg-blue-600/10"
                )}
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </form>
          <p className="text-[10px] text-text-secondary text-center mt-2">
            Akash.ai can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
