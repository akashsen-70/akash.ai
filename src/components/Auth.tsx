import React from 'react';
import { LogIn, UserCircle2, Bot, GraduationCap, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

interface AuthProps {
  onContinueAsGuest: () => void;
}

export default function Auth({ onContinueAsGuest }: AuthProps) {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 text-center relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/20"
          >
            <Bot size={40} className="text-white" />
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Akash.ai</h1>
            <p className="text-zinc-500 text-sm font-medium">Smart AI Study + Chat Assistant</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          {[
            { icon: <GraduationCap size={18} />, title: "Study Mode", desc: "Generate detailed exam-ready notes from any content." },
            { icon: <MessageSquare size={18} />, title: "Chat Mode", desc: "Conversational AI for questions, coding, and brainstorming." },
            { icon: <ShieldCheck size={18} />, title: "Secure & Smart", desc: "Your data is protected and analyzed with advanced AI." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-900 rounded-2xl text-left"
            >
              <div className="p-2 bg-zinc-800 rounded-xl text-blue-400">{feature.icon}</div>
              <div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs text-zinc-500">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-zinc-950 rounded-2xl font-semibold hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          
          <button
            onClick={onContinueAsGuest}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-2xl font-medium hover:bg-zinc-800 transition-all"
          >
            <UserCircle2 size={20} />
            Continue as Guest
          </button>
        </div>

        <p className="text-[11px] text-zinc-600 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Guest data is stored locally and may be lost if you clear your browser data.
        </p>
      </motion.div>
    </div>
  );
}
