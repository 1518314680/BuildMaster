'use client';

import { Component } from '@/lib/types';
import ImageWithFallback from '@/components/ImageWithFallback';

interface ComponentCardProps {
  component: Component;
  onSelect: () => void;
}

export default function ComponentCard({ component, onSelect }: ComponentCardProps) {
  // 处理图片URL（兼容image和imageUrl字段）
  const imageUrl = component.imageUrl || component.image || '/images/placeholder.png';
  
  // 是否有京东链接
  const hasJdLink = component.purchaseUrl && component.jdSkuId;
  
  // 是否有原价（显示折扣）
  const hasDiscount = component.originalPrice && component.originalPrice > component.price;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white">
      <div className="flex items-start space-x-3">
        <ImageWithFallback
          src={imageUrl}
          alt={component.name}
          width={64}
          height={64}
          className="w-16 h-16 object-contain flex-shrink-0"
          fallbackType={component.type}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {component.name}
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            {component.brand} {component.model && `· ${component.model}`}
          </p>
          
          {/* 价格信息 */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-red-600">
                ¥{component.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ¥{component.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* 京东标识和链接 */}
            {hasJdLink && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                  京东自营
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(component.purchaseUrl, '_blank');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  查看详情 →
                </button>
              </div>
            )}
            
            {/* 库存状态 */}
            {component.stockQuantity !== undefined && (
              <div className="text-xs">
                {component.stockQuantity > 0 ? (
                  <span className="text-green-600">
                    ✓ 有货 ({component.stockQuantity}件)
                  </span>
                ) : (
                  <span className="text-gray-400">暂时缺货</span>
                )}
              </div>
            )}
          </div>
          
          {/* 选择按钮 */}
          <button 
            onClick={onSelect}
            className="mt-2 w-full text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-1.5 rounded transition-colors"
          >
            选择此配件
          </button>
        </div>
      </div>
      
      {/* 规格信息 */}
      {component.specifications && Object.keys(component.specifications).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {Object.entries(component.specifications).slice(0, 4).map(([key, value]) => (
              <div key={key} className="truncate">
                <span className="font-medium text-gray-700">{key}:</span>{' '}
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
