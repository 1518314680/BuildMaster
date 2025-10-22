'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * 认证保护组件
 * 用于在客户端检查用户登录状态
 */
export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // 如果需要认证但用户未登录
    if (requireAuth && !isAuthenticated) {
      console.log('AuthGuard: 用户未登录，重定向到登录页');
      // 保存当前路径，登录后返回
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [requireAuth, isAuthenticated, pathname, router]);

  // 如果需要认证但用户未登录，显示加载状态
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证登录状态...</p>
        </div>
      </div>
    );
  }

  // 用户已登录或不需要认证，显示内容
  return <>{children}</>;
}

