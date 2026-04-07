import React from 'react';
import { Plus, MessageSquare, GraduationCap, LogOut, Trash2, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatSession } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  chats: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onLogout: () => void;
  user: any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  user,
  isOpen,
  setIsOpen,
  theme,
  setTheme
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-80 bg-bg-secondary text-text-primary flex flex-col z-50 transition-transform lg:relative lg:translate-x-0 border-r border-border-primary",
          !isOpen && "lg:w-80"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border-primary">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
            <span>Akash.ai</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-bg-tertiary rounded-md transition-colors text-text-secondary hover:text-text-primary"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-bg-tertiary rounded-md">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-bg-tertiary hover:bg-bg-tertiary/80 border border-border-primary rounded-xl transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative",
                currentChatId === chat.id ? "bg-bg-tertiary text-text-primary" : "text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary"
              )}
              onClick={() => {
                onSelectChat(chat.id);
                setIsOpen(false);
              }}
            >
              {chat.mode === 'study' ? <GraduationCap size={18} /> : <MessageSquare size={18} />}
              <span className="flex-1 truncate text-sm">{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-border-primary mt-auto">
          {user ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`}
                alt="Profile"
                className="w-9 h-9 rounded-full bg-bg-tertiary"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-bg-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-text-secondary mb-2">Guest Mode</p>
              <button
                onClick={onLogout}
                className="text-xs text-blue-500 hover:underline"
              >
                Sign In to Save Chats
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
