// Zustand 状态管理

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Component, BuildConfiguration, ComponentType } from '@/lib/types';

interface BuildState {
  // 当前构建配置
  currentBuild: Partial<BuildConfiguration>;
  
  // 已选择的组件
  selectedComponents: {
    [K in ComponentType]?: Component;
  };
  
  // 总价格
  totalPrice: number;
  
  // 加载状态
  isLoading: boolean;
  
  // 错误信息
  error: string | null;
  
  // Actions
  addComponent: (component: Component) => void;
  removeComponent: (type: ComponentType) => void;
  updateComponent: (type: ComponentType, component: Component) => void;
  clearBuild: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateTotalPrice: () => void;
  saveBuild: (name: string) => Promise<void>;
  loadBuild: (build: BuildConfiguration) => void;
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentBuild: {},
      selectedComponents: {},
      totalPrice: 0,
      isLoading: false,
      error: null,

      // 添加组件
      addComponent: (component: Component) => {
        set((state) => {
          const newComponents = {
            ...state.selectedComponents,
            [component.type]: component,
          };
          
          const newTotalPrice = Object.values(newComponents).reduce(
            (total, comp) => total + (comp?.price || 0),
            0
          );

          return {
            selectedComponents: newComponents,
            totalPrice: newTotalPrice,
            error: null,
          };
        });
      },

      // 移除组件
      removeComponent: (type: ComponentType) => {
        set((state) => {
          const newComponents = { ...state.selectedComponents };
          delete newComponents[type];
          
          const newTotalPrice = Object.values(newComponents).reduce(
            (total, comp) => total + (comp?.price || 0),
            0
          );

          return {
            selectedComponents: newComponents,
            totalPrice: newTotalPrice,
            error: null,
          };
        });
      },

      // 更新组件
      updateComponent: (type: ComponentType, component: Component) => {
        set((state) => {
          const newComponents = {
            ...state.selectedComponents,
            [type]: component,
          };
          
          const newTotalPrice = Object.values(newComponents).reduce(
            (total, comp) => total + (comp?.price || 0),
            0
          );

          return {
            selectedComponents: newComponents,
            totalPrice: newTotalPrice,
            error: null,
          };
        });
      },

      // 清空构建
      clearBuild: () => {
        set({
          selectedComponents: {},
          totalPrice: 0,
          currentBuild: {},
          error: null,
        });
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 设置错误信息
      setError: (error: string | null) => {
        set({ error });
      },

      // 计算总价格
      calculateTotalPrice: () => {
        set((state) => {
          const totalPrice = Object.values(state.selectedComponents).reduce(
            (total, comp) => total + (comp?.price || 0),
            0
          );
          return { totalPrice };
        });
      },

      // 保存构建配置
      saveBuild: async (name: string) => {
        const { selectedComponents, setLoading, setError } = get();
        
        setLoading(true);
        setError(null);

        try {
          // 这里应该调用 API 保存构建配置
          // const response = await buildApi.createBuild({
          //   components: Object.fromEntries(
          //     Object.entries(selectedComponents).map(([type, component]) => [
          //       type,
          //       component?.id || ''
          //     ])
          //   )
          // });

          // 模拟保存成功
          const newBuild: BuildConfiguration = {
            id: Date.now().toString(),
            name,
            components: selectedComponents,
            totalPrice: get().totalPrice,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set({
            currentBuild: newBuild,
            isLoading: false,
          });

          console.log('构建配置已保存:', newBuild);
        } catch (error) {
          setError(error instanceof Error ? error.message : '保存失败');
          setLoading(false);
        }
      },

      // 加载构建配置
      loadBuild: (build: BuildConfiguration) => {
        set({
          currentBuild: build,
          selectedComponents: build.components,
          totalPrice: build.totalPrice,
          error: null,
        });
      },
    }),
    {
      name: 'build-store',
      partialize: (state) => ({
        selectedComponents: state.selectedComponents,
        totalPrice: state.totalPrice,
        currentBuild: state.currentBuild,
      }),
    }
  )
);
