import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData: User) => {
        // 设置cookie
        document.cookie = `user_token=${userData.token || 'mock_token'}; path=/; max-age=86400`;
        document.cookie = `user_id=${userData.id}; path=/; max-age=86400`;
        
        set({ 
          user: userData, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        // 清除cookie
        document.cookie = 'user_token=; path=/; max-age=0';
        document.cookie = 'user_id=; path=/; max-age=0';
        
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

