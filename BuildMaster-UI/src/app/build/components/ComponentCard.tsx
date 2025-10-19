'use client';

import { Component } from '@/lib/types';

interface ComponentCardProps {
  component: Component;
  onSelect: () => void;
}

export default function ComponentCard({ component, onSelect }: ComponentCardProps) {
  return (
    <div
      onClick={onSelect}
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start space-x-3">
        <img
          src={component.image}
          alt={component.name}
          className="w-12 h-12 object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {component.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {component.brand} {component.model}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-blue-600">
              ¥{component.price.toLocaleString()}
            </span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              选择
            </button>
          </div>
        </div>
      </div>
      
      {/* 规格信息 */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          {Object.entries(component.specifications).slice(0, 4).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
