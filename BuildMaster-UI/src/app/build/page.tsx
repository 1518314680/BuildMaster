'use client';

import { useState } from 'react';
import PcBuildCanvas from './components/PcBuildCanvas';
import ComponentCard from './components/ComponentCard';
import ConfigSummary from './components/ConfigSummary';
import { useBuildStore } from '@/hooks/useBuildStore';
import { Component, ComponentType } from '@/lib/types';

// 模拟组件数据
const mockComponents: Component[] = [
  {
    id: 'cpu-1',
    name: 'Intel Core i7-13700K',
    type: 'cpu',
    brand: 'Intel',
    model: 'Core i7-13700K',
    price: 2499,
    image: '/images/cpu.png',
    specifications: {
      cores: 16,
      threads: 24,
      baseClock: '3.4 GHz',
      boostClock: '5.4 GHz',
      socket: 'LGA1700',
    },
  },
  {
    id: 'gpu-1',
    name: 'NVIDIA GeForce RTX 4070',
    type: 'gpu',
    brand: 'NVIDIA',
    model: 'RTX 4070',
    price: 3999,
    image: '/images/gpu.png',
    specifications: {
      memory: '12GB GDDR6X',
      memoryBus: '192-bit',
      baseClock: '1920 MHz',
      boostClock: '2475 MHz',
    },
  },
  {
    id: 'ram-1',
    name: 'Corsair Vengeance LPX 32GB',
    type: 'ram',
    brand: 'Corsair',
    model: 'Vengeance LPX',
    price: 899,
    image: '/images/ram.png',
    specifications: {
      capacity: '32GB',
      speed: 'DDR4-3200',
      modules: 2,
      latency: 'CL16',
    },
  },
  {
    id: 'motherboard-1',
    name: 'ASUS ROG Strix Z790-E',
    type: 'motherboard',
    brand: 'ASUS',
    model: 'ROG Strix Z790-E',
    price: 1999,
    image: '/images/motherboard.png',
    specifications: {
      socket: 'LGA1700',
      chipset: 'Intel Z790',
      formFactor: 'ATX',
      memorySlots: 4,
    },
  },
  {
    id: 'case-1',
    name: 'Fractal Design Meshify C',
    type: 'case',
    brand: 'Fractal Design',
    model: 'Meshify C',
    price: 599,
    image: '/images/case.png',
    specifications: {
      formFactor: 'Mid Tower',
      maxGpuLength: '315mm',
      maxCpuHeight: '170mm',
      driveBays: '2x 3.5", 2x 2.5"',
    },
  },
];

const componentTypes: ComponentType[] = ['cpu', 'gpu', 'ram', 'motherboard', 'case'];

export default function BuildPage() {
  const {
    selectedComponents,
    totalPrice,
    addComponent,
    removeComponent,
    clearBuild,
    saveBuild,
    isLoading,
    error,
  } = useBuildStore();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [buildName, setBuildName] = useState('');

  const handleAddComponent = (component: Component) => {
    addComponent(component);
  };

  const handleRemoveComponent = (type: ComponentType) => {
    removeComponent(type);
  };

  const handleSaveBuild = async () => {
    if (!buildName.trim()) return;
    
    await saveBuild(buildName);
    setShowSaveDialog(false);
    setBuildName('');
  };

  const handleClearBuild = () => {
    if (confirm('确定要清空当前配置吗？')) {
      clearBuild();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">装机配置器</h1>
          <p className="text-gray-600">选择您的硬件组件，构建完美的电脑配置</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：组件选择 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">选择组件</h2>
              
              <div className="space-y-6">
                {componentTypes.map((type) => {
                  const typeComponents = mockComponents.filter(comp => comp.type === type);
                  const selectedComponent = selectedComponents[type];
                  
                  return (
                    <div key={type} className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 capitalize">
                        {type === 'cpu' ? 'CPU' : 
                         type === 'gpu' ? '显卡' :
                         type === 'ram' ? '内存' :
                         type === 'motherboard' ? '主板' :
                         type === 'case' ? '机箱' : type}
                      </h3>
                      
                      {selectedComponent ? (
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={selectedComponent.image} 
                              alt={selectedComponent.name}
                              className="w-12 h-12 object-contain"
                            />
                            <div>
                              <p className="font-medium">{selectedComponent.name}</p>
                              <p className="text-sm text-gray-600">¥{selectedComponent.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveComponent(type)}
                            className="text-red-600 hover:text-red-800"
                          >
                            移除
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {typeComponents.map((component) => (
                            <ComponentCard
                              key={component.id}
                              component={component}
                              onSelect={() => handleAddComponent(component)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右侧：配置摘要和3D预览 */}
          <div className="space-y-6">
            {/* 3D 预览 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">3D 预览</h2>
              <PcBuildCanvas selectedComponents={selectedComponents} />
            </div>

            {/* 配置摘要 */}
            <ConfigSummary
              selectedComponents={selectedComponents}
              totalPrice={totalPrice}
              onSave={() => setShowSaveDialog(true)}
              onClear={handleClearBuild}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 保存对话框 */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">保存配置</h3>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="输入配置名称"
                className="w-full p-3 border rounded-lg mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveBuild}
                  disabled={!buildName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
