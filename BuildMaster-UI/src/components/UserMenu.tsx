'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push('/profile');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-4">
        <a 
          href="/login" 
          className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          登录
        </a>
        <a 
          href="/register" 
          className="px-5 py-2 border border-cyan-500 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500 hover:text-white transition-all duration-300"
        >
          注册
        </a>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* 用户按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-cyan-500/50 transition-all duration-200"
      >
        {/* 头像 */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:8080${user.avatarUrl}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            user.displayName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        
        {/* 用户名 */}
        <span className="text-gray-200 font-medium hidden sm:block">
          {user.displayName || user.username}
        </span>
        
        {/* 下拉箭头 */}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
          >
            {/* 用户信息区域 */}
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-white/10">
              <p className="text-sm text-gray-400">登录为</p>
              <p className="text-white font-semibold mt-1">
                {user.displayName || user.username}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {user.email}
              </p>
            </div>

            {/* 菜单项 */}
            <div className="py-2">
              <button
                onClick={handleProfile}
                className="w-full px-4 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>个人信息</span>
              </button>

              <a
                href="/build"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span>我的装机</span>
              </a>

              <a
                href="/ai-assistant"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI 推荐</span>
              </a>
            </div>

            {/* 退出登录 */}
            <div className="border-t border-white/10 py-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors duration-200 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>退出登录</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

