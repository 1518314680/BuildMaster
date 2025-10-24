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
  const [viewMode, setViewMode] = useState<'select' | 'summary'>('select'); // 视图模式：选择配件 | 配置摘要

  // 从数据库加载配件数据
  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoadingComponents(true);
        const response = await componentApi.getAllComponents();
        
        let rawData: any[] = [];
        if (response && Array.isArray(response)) {
          rawData = response;
        } else if (response.data && Array.isArray(response.data)) {
          rawData = response.data;
        } else {
          console.warn('[Build] API返回数据格式异常，使用空数组');
          setComponents([]);
          setLoadingComponents(false);
          return;
        }
        
        // 映射后端字段到前端类型
        const mappedComponents = rawData.map((item: any) => ({
          ...item,
          id: String(item.id),
          type: mapBackendTypeToFrontend(item.type),
          image: item.imageUrl || item.image || '/images/placeholder.png',
          specifications: parseSpecifications(item.specifications || item.specs),
          price: Number(item.price) || 0,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          stockQuantity: item.stockQuantity ?? undefined,
        }));
        
        setComponents(mappedComponents);
        console.log('[Build] 成功加载配件:', mappedComponents.length, '个');
        
        // 统计京东数据
        const jdCount = mappedComponents.filter((c: any) => c.jdSkuId && c.purchaseUrl).length;
        console.log('[Build] 包含京东实时数据:', jdCount, '个');
        
      } catch (err) {
        console.error('[Build] 加载配件失败:', err);
        console.warn('[Build] 后端API未连接，请确保后端服务已启动');
        setComponents([]);
      } finally {
        setLoadingComponents(false);
      }
    };

    loadComponents();
  }, []);
  
  // 映射后端类型枚举到前端类型
  const mapBackendTypeToFrontend = (backendType: string): ComponentType => {
    const typeMap: Record<string, ComponentType> = {
      'CPU': 'cpu',
      'GPU': 'gpu',
      'MOTHERBOARD': 'motherboard',
      'MEMORY': 'ram',
      'STORAGE': 'storage',
      'CASE': 'case',
      'POWER_SUPPLY': 'psu',
      'COOLER': 'cooler',
    };
    return typeMap[backendType] || backendType.toLowerCase() as ComponentType;
  };
  
  // 解析规格参数（可能是JSON字符串或对象）
  const parseSpecifications = (specs: any): Record<string, any> => {
    if (!specs) return {};
    if (typeof specs === 'string') {
      try {
        return JSON.parse(specs);
      } catch {
        return { 规格: specs };
      }
    }
    return specs;
  };

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
      setViewMode('select'); // 清空后返回选择模式
    }
  };

  // 切换到配置摘要
  const handleViewSummary = () => {
    if (Object.keys(selectedComponents).length === 0) {
      alert('请至少选择一个配件！');
      return;
    }
    setViewMode('summary');
  };

  // 返回选择配件
  const handleBackToSelect = () => {
    setViewMode('select');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🖥️ 装机配置器
          </h1>
          <p className="text-gray-600">
            {viewMode === 'select' ? '按照真实装机流程，选择您的硬件配件' : '查看您的装机配置'}
          </p>
          
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

        {/* 视图切换 */}
        {viewMode === 'select' ? (
          /* ========== 选择配件视图 ========== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：2.5D 装机幕布 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">🎨 2.5D 装机幕布</h2>
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔍 全屏查看
                  </button>
                </div>
                <div className="h-[600px]">
                  <PcBuildCanvas selectedComponents={selectedComponents} />
                </div>
              </div>
            </div>

            {/* 右侧：快捷操作面板 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">⚡ 快捷操作</h2>
                
                {/* 已选配件统计 */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">已选配件</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Object.keys(selectedComponents).length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    共需选择 {BUILD_ORDER.length} 个配件
                  </div>
                </div>

                {/* 总价预览 */}
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">当前总价</span>
                    <span className="text-2xl font-bold text-green-600">
                      ¥{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-2">
                  <button
                    onClick={handleViewSummary}
                    disabled={Object.keys(selectedComponents).length === 0}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    📋 查看配置摘要
                  </button>
                  
                  {Object.keys(selectedComponents).length > 0 && (
                    <button
                      onClick={handleClearBuild}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      🗑️ 清空配置
                    </button>
                  )}
                </div>

                {/* 提示信息 */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <span className="font-medium">提示：</span>
                    {Object.keys(selectedComponents).length === 0 
                      ? '请开始选择配件' 
                      : '选择完成后查看配置摘要'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========== 配置摘要视图 ========== */
          <div className="max-w-5xl mx-auto">
            <div className="mb-4">
              <button
                onClick={handleBackToSelect}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center space-x-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>返回选择配件</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：2.5D 装机幕布 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">🎨 2.5D 装机幕布</h2>
                    <button
                      onClick={() => setShowFullscreen(true)}
                      className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔍 全屏查看
                    </button>
                  </div>
                  <div className="h-[600px]">
                    <PcBuildCanvas selectedComponents={selectedComponents} />
                  </div>
                </div>
              </div>

              {/* 右侧：配置摘要 */}
              <div className="space-y-6">
                <ConfigSummary
                  selectedComponents={selectedComponents}
                  totalPrice={totalPrice}
                  onSave={() => setShowSaveDialog(true)}
                  onClear={handleClearBuild}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* 组件选择区域（仅在选择模式显示） */}
        {viewMode === 'select' && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">📦 选择配件</h2>
              {components.length > 0 && (
                <div className="text-sm text-gray-600">
                  共 {components.length} 个配件可选
                </div>
              )}
            </div>
            
            {components.length === 0 && !loadingComponents && (
              <div className="text-center py-8 text-gray-500 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="font-medium mb-2">暂无可用配件</p>
                <p className="text-sm mb-3">请确保后端服务已启动</p>
                <div className="text-xs text-left bg-white p-3 rounded mx-4">
                  <p className="font-mono">后端地址: {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}</p>
                  <p className="font-mono mt-1">接口: GET /api/components</p>
                  <p className="font-mono mt-1 text-red-600">⚠️ 请检查后端服务是否在此端口运行</p>
                </div>
              </div>
            )}
            
            {/* 装机进度连接线 */}
            {components.length > 0 && (
              <div className="mb-6 px-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>装机进度</span>
                  <span>{Object.keys(selectedComponents).length} / {BUILD_ORDER.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {BUILD_ORDER.map((type, index) => {
                    const isCompleted = !!selectedComponents[type];
                    return (
                      <div key={type} className="flex items-center flex-1">
                        {/* 进度圆点 */}
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-green-500 text-white scale-110 shadow-lg' 
                              : 'bg-gray-300 text-gray-600'
                          }`}
                          title={COMPONENT_TYPE_NAMES[type]}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        {/* 连接线 */}
                        {index < BUILD_ORDER.length - 1 && (
                          <div className={`flex-1 h-1 mx-1 transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* 图例 */}
                <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
                  {BUILD_ORDER.map((type) => {
                    const isCompleted = !!selectedComponents[type];
                    return (
                      <span 
                        key={type}
                        className={`transition-colors duration-300 ${
                          isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {COMPONENT_TYPE_NAMES[type]}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
              
            <div className="space-y-4">
              {BUILD_ORDER.map((type, index) => {
                const typeComponents = components.filter(comp => {
                  const compType = comp.type?.toLowerCase();
                  const targetType = type.toLowerCase();
                  return compType === targetType;
                });
                const selectedComponent = selectedComponents[type];
                const stepNumber = index + 1;
                const isCompleted = !!selectedComponent;
                
                return (
                  <div 
                    key={type} 
                    className={`border rounded-lg p-4 relative transition-all duration-300 ${
                      isCompleted 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* 步骤标记 */}
                    <div className={`absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </div>
                    
                    <h3 className={`text-lg font-medium mb-3 flex items-center space-x-2 transition-colors duration-300 ${
                      isCompleted ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      <span>{COMPONENT_TYPE_NAMES[type] || type}</span>
                      {selectedComponent && (
                        <span className="text-green-600 text-sm animate-pulse">✓ 已完成</span>
                      )}
                    </h3>
                      
                      {selectedComponent ? (
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            {(selectedComponent.imageUrl || selectedComponent.image) && (
                              <img 
                                src={selectedComponent.imageUrl || selectedComponent.image} 
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
                              {selectedComponent.jdSkuId && selectedComponent.purchaseUrl && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 inline-block">
                                  京东实时价格
                                </span>
                              )}
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
        )}

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
