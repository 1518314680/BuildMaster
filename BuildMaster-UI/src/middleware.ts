import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路由
const protectedRoutes = ['/build', '/ai-assistant', '/config', '/profile', '/admin'];

// 公开路由（不需要登录）
const publicRoutes = ['/', '/register', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🔧 开发模式：暂时禁用 middleware 保护
  // 原因：使用模拟登录，cookie 设置在客户端，服务器端读取可能有问题
  // 改用 AuthGuard 组件进行客户端保护
  // TODO: 等真实后端认证完成后再启用此保护
  
  const ENABLE_MIDDLEWARE_AUTH = false; // 设置为 true 启用 middleware 保护
  
  if (!ENABLE_MIDDLEWARE_AUTH) {
    // 禁用 middleware 保护，让请求通过
    // 页面保护由各页面的 AuthGuard 组件处理
    return NextResponse.next();
  }
  
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // 正确读取 cookie 值
    const token = request.cookies.get('user_token')?.value;
    const userId = request.cookies.get('user_id')?.value;
    
    console.log('[Middleware] 检查路由:', pathname);
    console.log('[Middleware] Token:', token);
    console.log('[Middleware] UserId:', userId);
    
    // 如果没有登录，重定向到登录页
    if (!token && !userId) {
      console.log('[Middleware] 未登录，重定向到登录页');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('[Middleware] 已登录，允许访问');
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

