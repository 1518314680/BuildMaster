'use client';

import { Component, ComponentType } from '@/lib/types';
import ImageWithFallback from '@/components/ImageWithFallback';

interface ConfigSummaryProps {
  selectedComponents: {
    [K in ComponentType]?: Component;
  };
  totalPrice: number;
  onSave: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const componentTypeNames: Record<ComponentType, string> = {
  cpu: 'CPU',
  gpu: '显卡',
  ram: '内存',
  motherboard: '主板',
  case: '机箱',
  storage: '存储',
  psu: '电源',
  cooler: '散热器',
};

export default function ConfigSummary({
  selectedComponents,
  totalPrice,
  onSave,
  onClear,
  isLoading,
}: ConfigSummaryProps) {
  const hasComponents = Object.keys(selectedComponents).length > 0;
  
  // 统计京东商品数量
  const jdComponentsCount = Object.values(selectedComponents).filter(
    (comp) => comp && comp.jdSkuId && comp.purchaseUrl
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <span>💰 配置摘要</span>
        {hasComponents && (
          <span className="text-sm font-normal text-gray-500">
            {Object.keys(selectedComponents).length} 个配件
          </span>
        )}
      </h2>
      
      {!hasComponents ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🛒</div>
          <p className="font-medium">还没有选择任何组件</p>
          <p className="text-sm mt-1">从下方选择您需要的硬件组件</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 组件列表 */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {Object.entries(selectedComponents).map(([type, component]) => {
              if (!component) return null;
              
              const hasJdLink = component.jdSkuId && component.purchaseUrl;
              const imageUrl = component.imageUrl || component.image || '/images/placeholder.png';
              
              return (
                <div key={type} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={component.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain flex-shrink-0"
                      fallbackType={component.type}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {componentTypeNames[type as ComponentType]}
                        </span>
                        {hasJdLink && (
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                            京东
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm line-clamp-2 mb-1">{component.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-red-600">
                          ¥{component.price.toLocaleString()}
                        </span>
                        {hasJdLink && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(component.purchaseUrl, '_blank');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            购买 →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 京东数据提示 */}
          {jdComponentsCount > 0 && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              <span className="font-medium">🏷️ 实时价格：</span>
              {jdComponentsCount} 个配件已接入京东实时数据
            </div>
          )}

          {/* 总价 */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">总计</span>
              <span className="text-2xl font-bold text-green-600">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-right">
              {jdComponentsCount > 0 ? '含京东实时价格' : '价格可能有延迟'}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="pt-4 space-y-2">
            <button
              onClick={onSave}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isLoading ? '保存中...' : '💾 保存配置'}
            </button>
            
            <button
              onClick={onClear}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🗑️ 清空配置
            </button>
          </div>

          {/* 兼容性检查提示 */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <span className="font-medium">提示：</span>建议在购买前检查组件兼容性
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
