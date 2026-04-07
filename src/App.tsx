import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, collection, doc, setDoc, getDoc, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, updateDoc, signOut } from './firebase';
import { ChatSession, Message } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';
import { v4 as uuidv4 } from 'uuid';
import { Menu } from 'lucide-react';
import { generateAIResponse } from './services/geminiService';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [isGuest, setIsGuest] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'study' | 'chat'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load chats
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
        setChats(chatList);
      });
      return () => unsubscribe();
    } else if (isGuest) {
      const savedChats = JSON.parse(localStorage.getItem('guest_chats') || '[]');
      setChats(savedChats);
    }
  }, [user, isGuest]);

  // Load messages
  useEffect(() => {
    if (currentChatId) {
      if (user) {
        const q = query(
          collection(db, `chats/${currentChatId}/messages`),
          orderBy('createdAt', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
          setMessages(messageList);
        });
        return () => unsubscribe();
      } else if (isGuest) {
        const savedMessages = JSON.parse(localStorage.getItem(`guest_messages_${currentChatId}`) || '[]');
        setMessages(savedMessages);
      }
    } else {
      setMessages([]);
    }
  }, [currentChatId, user, isGuest]);

  const handleNewChat = async () => {
    const newChatId = uuidv4();
    const newChat: ChatSession = {
      id: newChatId,
      userId: user?.uid || 'guest',
      title: 'New Chat',
      mode: mode,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (user) {
      await setDoc(doc(db, 'chats', newChatId), newChat);
    } else {
      const updatedChats = [newChat, ...chats];
      setChats(updatedChats);
      localStorage.setItem('guest_chats', JSON.stringify(updatedChats));
    }
    setCurrentChatId(newChatId);
  };

  const handleDeleteChat = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, 'chats', id));
    } else {
      const updatedChats = chats.filter(c => c.id !== id);
      setChats(updatedChats);
      localStorage.setItem('guest_chats', JSON.stringify(updatedChats));
      localStorage.removeItem(`guest_messages_${id}`);
    }
    if (currentChatId === id) setCurrentChatId(null);
  };

  const handleSendMessage = async (content: string, currentMode: 'study' | 'chat', images?: string[]) => {
    let chatId = currentChatId;
    
    // Create new chat if none exists
    if (!chatId) {
      chatId = uuidv4();
      const newChat: ChatSession = {
        id: chatId,
        userId: user?.uid || 'guest',
        title: content.slice(0, 30) + '...',
        mode: currentMode,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (user) {
        await setDoc(doc(db, 'chats', chatId), newChat);
      } else {
        const updatedChats = [newChat, ...chats];
        setChats(updatedChats);
        localStorage.setItem('guest_chats', JSON.stringify(updatedChats));
      }
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      chatId,
      role: 'user',
      content,
      createdAt: new Date()
    };

    // Save user message
    if (user) {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        ...userMessage,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'chats', chatId), { updatedAt: serverTimestamp() });
    } else {
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      localStorage.setItem(`guest_messages_${chatId}`, JSON.stringify(updatedMessages));
    }

    setIsGenerating(true);

    try {
      const aiContent = await generateAIResponse([...messages, userMessage], currentMode, images);

      const aiMessage: Message = {
        id: uuidv4(),
        chatId: chatId!,
        role: 'assistant',
        content: aiContent || 'I encountered an error generating a response.',
        createdAt: new Date()
      };

      // Save AI message
      if (user) {
        await addDoc(collection(db, `chats/${chatId}/messages`), {
          ...aiMessage,
          createdAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'chats', chatId!), { updatedAt: serverTimestamp() });
      } else {
        const finalMessages = [...messages, userMessage, aiMessage];
        setMessages(finalMessages);
        localStorage.setItem(`guest_messages_${chatId}`, JSON.stringify(finalMessages));
      }
    } catch (error) {
      console.error('Chat Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    if (user) {
      await signOut(auth);
    } else {
      setIsGuest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Auth onContinueAsGuest={() => setIsGuest(true)} />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Mobile Menu Trigger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
      >
        <Menu size={20} />
      </button>

      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        theme={theme}
        setTheme={setTheme}
      />

      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}
