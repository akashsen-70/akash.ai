import React from 'react';
import { Plus, MessageSquare, GraduationCap, LogOut, Trash2, Menu, X, User } from 'lucide-react';
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
  onOpenProfile: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  user,
  onOpenProfile,
  isOpen,
  setIsOpen
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
          "fixed top-0 left-0 bottom-0 w-80 bg-zinc-900 text-zinc-100 flex flex-col z-50 transition-transform lg:relative lg:translate-x-0",
          !isOpen && "lg:w-80"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
            <span>Akash.ai</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-zinc-800 rounded-md">
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            New Chat
          </button>
          <button
            onClick={() => {
              onOpenProfile();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors text-sm font-medium text-zinc-300"
          >
            <User size={18} />
            My Profile
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative",
                currentChatId === chat.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
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
        <div className="p-4 border-t border-zinc-800 mt-auto">
          {user ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`}
                alt="Profile"
                className="w-9 h-9 rounded-full bg-zinc-700"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-zinc-500 mb-2">Guest Mode</p>
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
