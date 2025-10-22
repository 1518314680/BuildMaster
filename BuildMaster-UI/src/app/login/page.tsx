'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 登录处理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: 实现真实的登录API调用
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 保存用户信息到store（会自动处理cookie）
        login({
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
          displayName: result.data.displayName,
          token: result.data.token,
        });
        
        // 使用完整页面跳转而不是客户端路由，确保 cookie 被正确发送
        window.location.href = redirectTo;
      } else {
        setError(result.message || '登录失败，请检查邮箱和密码');
      }
    } catch (err) {
      // 开发环境：模拟登录成功（待后端API完成后删除）
      console.warn('登录API未实现，使用模拟登录');
      login({
        id: 1,
        username: 'testuser',
        email: formData.email,
        displayName: '测试用户',
        token: 'mock_token',
      });
      // 使用完整页面跳转
      window.location.href = redirectTo;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">欢迎回来</h1>
          <p className="text-gray-600">登录 BuildMaster 装机平台</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-gray-800"
              placeholder="your@email.com"
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-gray-800"
              placeholder="输入密码"
            />
          </div>

          {/* 记住我和忘记密码 */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">记住我</span>
            </label>
            <a href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700">
              忘记密码？
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 开发提示 */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>开发提示：</strong>后端登录API未实现，当前使用模拟登录
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            还没有账户？{' '}
            <a href="/register" className="text-cyan-600 hover:text-cyan-700 font-semibold">
              立即注册
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

