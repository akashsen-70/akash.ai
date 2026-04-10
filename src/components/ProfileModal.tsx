import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Calendar, Check, Edit2 } from 'lucide-react';
import { UserProfile } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

export default function ProfileModal({ isOpen, onClose, profile, onUpdate }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    gender: profile.gender || 'male',
    dob: profile.dob || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl relative z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
              <h2 className="text-xl font-bold">My Profile</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <img
                    src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=2563eb&color=fff`}
                    alt="Profile"
                    className="w-24 h-24 rounded-[2rem] object-cover border-4 border-zinc-800 shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center border-4 border-zinc-900">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-4">{profile.firstName} {profile.lastName}</h3>
                <p className="text-zinc-500 text-sm">{profile.email}</p>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
                      <div className="p-2 bg-zinc-800 rounded-xl text-blue-400">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Mobile Number</p>
                        <p className="text-sm font-medium">{profile.mobileNo}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
                      <div className="p-2 bg-zinc-800 rounded-xl text-purple-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Date of Birth</p>
                        <p className="text-sm font-medium">{profile.dob}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
                      <div className="p-2 bg-zinc-800 rounded-xl text-pink-400">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Gender</p>
                        <p className="text-sm font-medium capitalize">{profile.gender}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-semibold transition-all mt-4"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 ml-1">First Name</label>
                      <input
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 ml-1">Last Name</label>
                      <input
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                      />
                    </div>
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
                    <input
                      required
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
