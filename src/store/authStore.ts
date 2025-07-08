import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Mock authentication - In real app, this would call your API
const mockAuth = {
  login: async (email: string, password: string) => {
    if (email === 'demo@lms.com' && password === 'demo123') {
      return {
        user: {
          id: '1',
          email: 'demo@lms.com',
          name: 'Demo User',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          role: 'student' as const,
          createdAt: new Date(),
          enrolledCourses: ['1', '2'],
          completedCourses: ['3'],
          achievements: []
        },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },
  signup: async (name: string, email: string, password: string) => {
    return {
      user: {
        id: Date.now().toString(),
        email,
        name,
        role: 'student' as const,
        createdAt: new Date(),
        enrolledCourses: [],
        completedCourses: [],
        achievements: []
      },
      token: 'mock-jwt-token'
    };
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const { user, token } = await mockAuth.login(email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          const { user, token } = await mockAuth.signup(name, email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);