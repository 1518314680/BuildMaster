'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackType?: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooler';
}

// 组件类型到图片的映射
const TYPE_IMAGE_MAP: Record<string, string> = {
  cpu: '/images/cpu.png',
  gpu: '/images/gpu.png',
  motherboard: '/images/motherboard.png',
  ram: '/images/ram.png',
  memory: '/images/ram.png',
  storage: '/images/case.png', // 暂用case图片
  psu: '/images/case.png',
  power_supply: '/images/case.png',
  case: '/images/case.png',
  cooler: '/images/cpu.png', // 暂用cpu图片
};

/**
 * 带回退的图片组件
 * 优先使用传入的src，失败后使用类型对应的本地图片，最后使用占位图
 */
export default function ImageWithFallback({
  src,
  alt,
  width = 48,
  height = 48,
  className = '',
  fallbackType,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || '');
  const [error, setError] = useState(false);

  // 获取回退图片
  const getFallbackSrc = () => {
    if (fallbackType && TYPE_IMAGE_MAP[fallbackType.toLowerCase()]) {
      return TYPE_IMAGE_MAP[fallbackType.toLowerCase()];
    }
    return '/images/placeholder.png';
  };

  const handleError = () => {
    if (!error) {
      setError(true);
      const fallback = getFallbackSrc();
      setImgSrc(fallback);
    }
  };

  // 如果没有src，直接使用fallback
  const displaySrc = imgSrc || getFallbackSrc();

  return (
    <img
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      style={{ objectFit: 'contain' }}
    />
  );
}

