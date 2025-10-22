import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路由
const protectedRoutes = ['/build', '/ai-assistant', '/config'];

// 公开路由（不需要登录）
const publicRoutes = ['/', '/register', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // 检查是否有用户session/token（这里需要根据您的认证方式调整）
    // 暂时检查cookie中是否有用户token
    const token = request.cookies.get('user_token');
    const userId = request.cookies.get('user_id');
    
    // 如果没有登录，重定向到登录页
    if (!token && !userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// 配置哪些路由需要运行中间件
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public文件夹中的文件
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};

