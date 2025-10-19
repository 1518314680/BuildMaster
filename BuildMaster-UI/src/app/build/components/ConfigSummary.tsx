'use client';

import { Component, ComponentType } from '@/lib/types';

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">配置摘要</h2>
      
      {!hasComponents ? (
        <div className="text-center py-8 text-gray-500">
          <p>还没有选择任何组件</p>
          <p className="text-sm">从左侧选择您需要的硬件组件</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 组件列表 */}
          <div className="space-y-3">
            {Object.entries(selectedComponents).map(([type, component]) => {
              if (!component) return null;
              
              return (
                <div key={type} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <img
                      src={component.image}
                      alt={component.name}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <p className="font-medium text-sm">{component.name}</p>
                      <p className="text-xs text-gray-600">
                        {componentTypeNames[type as ComponentType]}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-blue-600">
                    ¥{component.price.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 总价 */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">总计</span>
              <span className="text-2xl font-bold text-green-600">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="pt-4 space-y-2">
            <button
              onClick={onSave}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '保存中...' : '保存配置'}
            </button>
            
            <button
              onClick={onClear}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              清空配置
            </button>
          </div>

          {/* 兼容性检查提示 */}
          <div className="pt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 建议在购买前检查组件兼容性
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
