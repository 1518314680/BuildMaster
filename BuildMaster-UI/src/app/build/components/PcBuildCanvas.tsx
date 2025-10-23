'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Component, ComponentType } from '@/lib/types';

interface PcBuildCanvasProps {
  selectedComponents: {
    [K in ComponentType]?: Component;
  };
  fullscreen?: boolean;
}

export default function PcBuildCanvas({ selectedComponents, fullscreen = false }: PcBuildCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [scale, setScale] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef<number>();

  // 检查是否装机完成（所有主要组件都有）
  const isComplete = !!(
    selectedComponents.case &&
    selectedComponents.motherboard &&
    selectedComponents.cpu &&
    selectedComponents.ram
  );

  // 绘制3D风格的组件
  const draw3DBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    color: string,
    opacity: number = 1
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity;

    // 主表面
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    // 右侧面（3D效果）
    const gradient = ctx.createLinearGradient(x + width, y, x + width + depth, y + depth);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustColor(color, -30));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width + depth, y + depth);
    ctx.lineTo(x + width + depth, y + height + depth);
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
    ctx.fill();

    // 顶部面（3D效果）
    const topGradient = ctx.createLinearGradient(x, y, x + depth, y - depth);
    topGradient.addColorStop(0, adjustColor(color, 20));
    topGradient.addColorStop(1, color);
    ctx.fillStyle = topGradient;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + depth, y + depth);
    ctx.lineTo(x + width + depth, y + depth);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();

    // 边框
    ctx.strokeStyle = adjustColor(color, -40);
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.restore();
  };

  // 调整颜色亮度
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // 绘制发光效果（开机状态）
  const drawGlow = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 主绘制函数
    const draw = () => {
      const { width, height } = canvas;
      const centerX = width / 2;
      const centerY = height / 2;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 绘制背景渐变
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#0f172a');
      bgGradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 绘制网格背景
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const baseScale = fullscreen ? scale : 1;
      const offsetX = centerX;
      const offsetY = centerY;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(baseScale, baseScale);
      ctx.translate(-centerX, -centerY);

      // 1. 绘制机箱（最底层）
      if (selectedComponents.case) {
        draw3DBox(ctx, centerX - 140, centerY - 100, 280, 200, 30, '#334155', 1);
        
        // 机箱前面板
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(centerX - 135, centerY - 95, 270, 190);
        
        // 电源指示灯
        if (isPoweredOn) {
          drawGlow(ctx, centerX - 110, centerY - 80, 15, 'rgba(34, 197, 94, 0.8)');
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(centerX - 110, centerY - 80, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. 绘制电源（底部）
      if (selectedComponents.psu) {
        draw3DBox(ctx, centerX - 120, centerY + 60, 100, 30, 20, '#f59e0b', 1);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PSU', centerX - 70, centerY + 78);
      }

      // 3. 绘制主板
      if (selectedComponents.motherboard) {
        draw3DBox(ctx, centerX - 110, centerY - 70, 220, 140, 25, '#059669', 1);
        
        // PCB 纹理
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo(centerX - 100 + i * 20, centerY - 60);
          ctx.lineTo(centerX - 100 + i * 20, centerY + 60);
          ctx.stroke();
        }
        
        // PCI插槽
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(centerX - 100, centerY - 20 + i * 25, 200, 3);
        }
      }

      // 4. 绘制CPU
      if (selectedComponents.cpu) {
        draw3DBox(ctx, centerX - 30, centerY - 40, 60, 60, 15, '#3b82f6', 1);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CPU', centerX, centerY - 5);
        
        if (isPoweredOn) {
          // CPU工作时的发热效果
          drawGlow(ctx, centerX, centerY - 10, 40, 'rgba(239, 68, 68, 0.3)');
        }
      }

      // 5. 绘制散热器
      if (selectedComponents.cooler) {
        // 散热器底座
        draw3DBox(ctx, centerX - 35, centerY - 65, 70, 20, 12, '#6b7280', 1);
        
        // 散热片
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = '#9ca3af';
          ctx.fillRect(centerX - 30 + i * 10, centerY - 80, 8, 15);
        }
        
        // 风扇
        if (isPoweredOn) {
          const fanAngle = (animationFrame * 0.2) % (Math.PI * 2);
          ctx.save();
          ctx.translate(centerX, centerY - 73);
          ctx.rotate(fanAngle);
          
          for (let i = 0; i < 4; i++) {
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(i * Math.PI / 2) * 25, Math.sin(i * Math.PI / 2) * 25);
            ctx.lineTo(Math.cos((i + 0.3) * Math.PI / 2) * 30, Math.sin((i + 0.3) * Math.PI / 2) * 30);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // 6. 绘制内存条
      if (selectedComponents.ram) {
        const memorySlots = 4;
        for (let i = 0; i < Math.min(memorySlots, 2); i++) {
          draw3DBox(ctx, centerX + 50, centerY - 60 + i * 30, 50, 20, 10, '#8b5cf6', 1);
          
          // 金手指
          ctx.fillStyle = '#fbbf24';
          for (let j = 0; j < 8; j++) {
            ctx.fillRect(centerX + 52 + j * 6, centerY - 53 + i * 30, 4, 6);
          }
        }
        
        if (isPoweredOn) {
          // RGB灯效
          const rgbColors = ['#ef4444', '#22c55e', '#3b82f6'];
          for (let i = 0; i < 2; i++) {
            const color = rgbColors[(animationFrame + i) % rgbColors.length];
            drawGlow(ctx, centerX + 75, centerY - 50 + i * 30, 15, color);
          }
        }
      }

      // 7. 绘制存储
      if (selectedComponents.storage) {
        draw3DBox(ctx, centerX - 110, centerY + 20, 80, 25, 15, '#14b8a6', 1);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SSD', centerX - 70, centerY + 35);
        
        if (isPoweredOn) {
          // 读写指示灯
          if (animationFrame % 30 < 15) {
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(centerX - 115, centerY + 25, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 8. 绘制显卡（最上层）
      if (selectedComponents.gpu) {
        draw3DBox(ctx, centerX - 100, centerY + 30, 120, 50, 20, '#ef4444', 1);
        
        // GPU 散热器
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(centerX - 95, centerY + 35, 110, 40);
        
        // 风扇
        if (isPoweredOn) {
          const fanAngle = (animationFrame * 0.15) % (Math.PI * 2);
          for (let f = 0; f < 2; f++) {
            ctx.save();
            ctx.translate(centerX - 60 + f * 40, centerY + 55);
            ctx.rotate(fanAngle);
            
            for (let i = 0; i < 3; i++) {
              ctx.fillStyle = '#374151';
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(i * Math.PI * 2 / 3) * 15, Math.sin(i * Math.PI * 2 / 3) * 15);
              ctx.lineTo(Math.cos((i + 0.4) * Math.PI * 2 / 3) * 18, Math.sin((i + 0.4) * Math.PI * 2 / 3) * 18);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
          }
          
          // GPU 工作指示灯
          drawGlow(ctx, centerX + 10, centerY + 33, 10, 'rgba(239, 68, 68, 0.6)');
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GPU', centerX - 40, centerY + 58);
      }

      ctx.restore();

      // 绘制组件统计
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      const componentCount = Object.keys(selectedComponents).length;
      ctx.fillText(`已安装组件: ${componentCount}/8`, 10, height - 10);

      if (isComplete) {
        ctx.textAlign = 'right';
        ctx.fillText('装机完成! 点击电源按钮开机 →', width - 10, height - 10);
      }
    };

    // 动画循环
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedComponents, isPoweredOn, scale, animationFrame, fullscreen, isComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
      
      {/* 控制面板 */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        {/* 电源按钮 */}
        {isComplete && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPoweredOn(!isPoweredOn)}
            className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-all ${
              isPoweredOn
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isPoweredOn ? '⏻ 关机' : '⏻ 开机'}
          </motion.button>
        )}
        
        {/* 缩放控制 */}
        {fullscreen && (
          <div className="bg-gray-800 bg-opacity-90 rounded-lg p-2 flex flex-col space-y-1">
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              +
            </button>
            <button
              onClick={() => setScale(1)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
            >
              {(scale * 100).toFixed(0)}%
            </button>
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              -
            </button>
          </div>
        )}
      </div>

      {/* 装机提示 */}
      <AnimatePresence>
        {!isComplete && Object.keys(selectedComponents).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-gray-800 bg-opacity-90 rounded-lg p-8 text-center max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2">🚀 开始装机</h3>
              <p className="text-gray-300">
                从左侧选择组件，按照顺序完成您的电脑装配
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 开机动画效果 */}
      <AnimatePresence>
        {isPoweredOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500 mix-blend-screen pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
