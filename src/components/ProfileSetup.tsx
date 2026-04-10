import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Calendar, Users, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileSetupProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    mobileNo: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
  }) => Promise<void>;
}

export default function ProfileSetup({ onSubmit }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dob: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-zinc-500 text-sm mt-2">Please provide a few details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 ml-1">First Name</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  placeholder="John"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 ml-1">Last Name</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                required
                type="tel"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
            <p className="text-[10px] text-zinc-600 ml-1">Note: Mobile number cannot be changed later.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm transition-all",
                  formData.gender === 'male'
                    ? "bg-blue-600/10 border-blue-600 text-blue-500"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                )}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm transition-all",
                  formData.gender === 'female'
                    ? "bg-pink-600/10 border-pink-600 text-pink-500"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                )}
              >
                Female
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                required
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={20} />
                Complete Setup
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
