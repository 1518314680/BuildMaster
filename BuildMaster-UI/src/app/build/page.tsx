'use client';

import { useState, useEffect } from 'react';
import PcBuildCanvas from './components/PcBuildCanvas';
import ComponentCard from './components/ComponentCard';
import ConfigSummary from './components/ConfigSummary';
import AuthGuard from '@/components/AuthGuard';
import { useBuildStore } from '@/hooks/useBuildStore';
import { Component, ComponentType } from '@/lib/types';
import { componentApi } from '@/lib/api';

// 真实装机顺序（按照实际装机流程）
const BUILD_ORDER: ComponentType[] = [
  'case',        // 1. 机箱（底座）
  'psu',         // 2. 电源（装在机箱底部）
  'motherboard', // 3. 主板（装在机箱内）
  'cpu',         // 4. CPU（装在主板上）
  'cooler',      // 5. 散热器（装在CPU上）
  'ram',         // 6. 内存（插在主板上）
  'storage',     // 7. 存储（装在机箱上）
  'gpu',         // 8. 显卡（最后装，插在主板上）
];

// 组件类型的中文名称映射
const COMPONENT_TYPE_NAMES: Record<ComponentType, string> = {
  case: '机箱',
  psu: '电源',
  motherboard: '主板',
  cpu: 'CPU',
  cooler: '散热器',
  ram: '内存',
  storage: '存储',
  gpu: '显卡',
};

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
  const [components, setComponents] = useState<Component[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // 当前装机步骤
  const [showFullscreen, setShowFullscreen] = useState(false); // 全屏预览

  // 从数据库加载配件数据
  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoadingComponents(true);
        const response = await componentApi.getAllComponents();
        
        if (response && Array.isArray(response)) {
          // 直接使用返回的数据
          setComponents(response);
          console.log('[Build] 成功加载配件:', response.length);
        } else if (response.data && Array.isArray(response.data)) {
          // 如果数据在 data 字段中
          setComponents(response.data);
          console.log('[Build] 成功加载配件:', response.data.length);
        } else {
          console.warn('[Build] API返回数据格式异常，使用空数组');
          setComponents([]);
        }
      } catch (err) {
        console.error('[Build] 加载配件失败:', err);
        // 开发环境：如果后端未启动，显示提示
        console.warn('[Build] 后端API未连接，请确保后端服务已启动');
        setComponents([]);
      } finally {
        setLoadingComponents(false);
      }
    };

    loadComponents();
  }, []);

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

  // 加载状态
  if (loadingComponents) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">正在加载配件数据...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🖥️ 装机配置器</h1>
          <p className="text-gray-600">按照真实装机流程，选择您的硬件组件</p>
          
          {/* 装机进度条 */}
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">装机进度</span>
              <span className="text-sm text-gray-600">
                {Object.keys(selectedComponents).length} / {BUILD_ORDER.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(Object.keys(selectedComponents).length / BUILD_ORDER.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：组件选择（按装机顺序） */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">📦 按顺序选择组件</h2>
              
              {components.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">⚠️ 暂无可用配件</p>
                  <p className="text-sm">请确保后端服务已启动并导入配件数据</p>
                </div>
              )}
              
              <div className="space-y-6">
                {BUILD_ORDER.map((type, index) => {
                  const typeComponents = components.filter(comp => {
                    // 处理类型映射（后端可能使用大写或不同的命名）
                    const compType = comp.type?.toLowerCase();
                    const targetType = type.toLowerCase();
                    return compType === targetType || 
                           (targetType === 'ram' && compType === 'memory') ||
                           (targetType === 'psu' && (compType === 'power' || compType === 'power_supply'));
                  });
                  const selectedComponent = selectedComponents[type];
                  const stepNumber = index + 1;
                  
                  return (
                    <div key={type} className="border rounded-lg p-4 relative">
                      {/* 步骤标记 */}
                      <div className="absolute -left-3 -top-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {stepNumber}
                      </div>
                      
                      <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
                        <span>{COMPONENT_TYPE_NAMES[type] || type}</span>
                        {selectedComponent && (
                          <span className="text-green-600 text-sm">✓ 已选择</span>
                        )}
                      </h3>
                      
                      {selectedComponent ? (
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            {selectedComponent.image && (
                              <img 
                                src={selectedComponent.image} 
                                alt={selectedComponent.name}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder.png';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-medium">{selectedComponent.name}</p>
                              <p className="text-sm text-gray-600">
                                ¥{selectedComponent.price?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveComponent(type)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                          >
                            移除
                          </button>
                        </div>
                      ) : (
                        <>
                          {typeComponents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {typeComponents.map((component) => (
                                <ComponentCard
                                  key={component.id}
                                  component={component}
                                  onSelect={() => handleAddComponent(component)}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              暂无可用的{COMPONENT_TYPE_NAMES[type]}
                            </div>
                          )}
                        </>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">🎨 2.5D 预览</h2>
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  全屏查看
                </button>
              </div>
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

        {/* 全屏预览模态框 */}
        {showFullscreen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
            <div className="w-full h-full p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">装机预览 - 全屏模式</h2>
                <button
                  onClick={() => setShowFullscreen(false)}
                  className="text-white hover:text-gray-300 text-2xl px-4"
                >
                  ✕
                </button>
              </div>
              <div className="w-full h-[calc(100%-80px)] bg-gray-900 rounded-lg overflow-hidden">
                <PcBuildCanvas 
                  selectedComponents={selectedComponents} 
                  fullscreen={true}
                />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </AuthGuard>
  );
}
