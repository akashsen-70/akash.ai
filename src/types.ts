export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  mobileNo?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
  profileCompleted?: boolean;
  createdAt: any;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  mode: 'study' | 'chat';
  createdAt: any;
  updatedAt: any;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'notes';
  createdAt: any;
}
