'use client';

import { useEffect, useRef } from 'react';
import { Component, ComponentType } from '@/lib/types';

interface PcBuildCanvasProps {
  selectedComponents: {
    [K in ComponentType]?: Component;
  };
}

export default function PcBuildCanvas({ selectedComponents }: PcBuildCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 绘制函数
    const draw = () => {
      const { width, height } = canvas;
      const centerX = width / 2;
      const centerY = height / 2;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 绘制背景
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // 绘制机箱轮廓
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 100, centerY - 80, 200, 160);

      // 绘制主板
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(centerX - 80, centerY - 60, 160, 120);

      // 绘制选中的组件
      Object.entries(selectedComponents).forEach(([type, component], index) => {
        if (!component) return;

        const colors = {
          cpu: '#3b82f6',
          gpu: '#ef4444',
          ram: '#10b981',
          motherboard: '#8b5cf6',
          case: '#f59e0b',
        };

        const color = colors[type as keyof typeof colors] || '#6b7280';
        
        // 根据组件类型绘制不同位置
        switch (type) {
          case 'cpu':
            // CPU 在主板中央
            ctx.fillStyle = color;
            ctx.fillRect(centerX - 15, centerY - 15, 30, 30);
            break;
          case 'gpu':
            // GPU 在主板下方
            ctx.fillStyle = color;
            ctx.fillRect(centerX - 40, centerY + 20, 80, 20);
            break;
          case 'ram':
            // 内存条在主板右侧
            ctx.fillStyle = color;
            ctx.fillRect(centerX + 20, centerY - 30, 15, 60);
            break;
          case 'motherboard':
            // 主板已经绘制
            break;
          case 'case':
            // 机箱已经绘制
            break;
        }
      });

      // 绘制组件标签
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      Object.entries(selectedComponents).forEach(([type, component]) => {
        if (!component) return;
        
        const labelY = centerY + 100;
        ctx.fillText(component.name, centerX, labelY);
      });
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedComponents]);

  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
