// src/app/layout.tsx
'use client';

import "./globals.css";
import { Inter } from "next/font/google";
import UserMenu from "@/components/UserMenu";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-slate-950 min-h-screen`}>
        {/* 科幻导航栏 */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                BuildMaster
              </span>
            </a>

            {/* 导航菜单 */}
            <div className="hidden md:flex items-center gap-6">
              <a 
                href="/#features" 
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
              >
                核心功能
              </a>
              <a 
                href="/#ai" 
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
              >
                AI 大师
              </a>
              <a 
                href="/build" 
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                开始装机
              </a>
              
              {/* 用户菜单 */}
              <UserMenu />
            </div>

            {/* 移动端菜单按钮 */}
            <button className="md:hidden p-2 text-gray-300 hover:text-cyan-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* 主要内容区域 */}
        <main className="pt-16">{children}</main>

        {/* 科幻页脚 */}
        <footer className="relative mt-20 bg-slate-950 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* 品牌信息 */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    BuildMaster
                  </span>
                </div>
                <p className="text-gray-400 max-w-md leading-relaxed">
                  AI 驱动的智能装机平台，为您提供专业的装机方案、实时兼容性检测和全网价格比较服务。
                </p>
              </div>

              {/* 快速链接 */}
              <div>
                <h3 className="text-white font-bold mb-4">快速链接</h3>
                <ul className="space-y-2">
                  <li><a href="/#features" className="text-gray-400 hover:text-cyan-400 transition-colors">核心功能</a></li>
                  <li><a href="/#ai" className="text-gray-400 hover:text-cyan-400 transition-colors">AI 推荐</a></li>
                  <li><a href="/build" className="text-gray-400 hover:text-cyan-400 transition-colors">开始装机</a></li>
                </ul>
              </div>

              {/* 联系方式 */}
              <div>
                <h3 className="text-white font-bold mb-4">联系我们</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@buildmaster.com
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    中国·深圳
                  </li>
                </ul>
              </div>
            </div>

            {/* 版权信息 */}
            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-gray-500">
                © 2025 <span className="text-cyan-400 font-semibold">BuildMaster</span> · 智能装机由你掌控 · All Rights Reserved
              </p>
            </div>
          </div>

          {/* 装饰性渐变 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        </footer>
      </body>
    </html>
  );
}
