// API 请求封装

import axios from 'axios';
import { Component, BuildConfiguration, ApiResponse, BuildRequest, CompatibilityCheck } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 组件相关 API
export const componentApi = {
  // 获取所有组件
  getAllComponents: async (): Promise<ApiResponse<Component[]>> => {
    const response = await api.get('/api/components');
    return response.data;
  },

  // 根据类型获取组件
  getComponentsByType: async (type: string): Promise<ApiResponse<Component[]>> => {
    const response = await api.get(`/api/components/type/${type}`);
    return response.data;
  },

  // 搜索组件
  searchComponents: async (query: string): Promise<ApiResponse<Component[]>> => {
    const response = await api.get(`/api/components/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // 获取组件详情
  getComponentById: async (id: string): Promise<ApiResponse<Component>> => {
    const response = await api.get(`/api/components/${id}`);
    return response.data;
  },
};

// 构建配置相关 API
export const buildApi = {
  // 获取用户的构建配置
  getUserBuilds: async (): Promise<ApiResponse<BuildConfiguration[]>> => {
    const response = await api.get('/api/builds');
    return response.data;
  },

  // 创建新的构建配置
  createBuild: async (buildData: BuildRequest): Promise<ApiResponse<BuildConfiguration>> => {
    const response = await api.post('/api/builds', buildData);
    return response.data;
  },

  // 更新构建配置
  updateBuild: async (id: string, buildData: Partial<BuildRequest>): Promise<ApiResponse<BuildConfiguration>> => {
    const response = await api.put(`/api/builds/${id}`, buildData);
    return response.data;
  },

  // 删除构建配置
  deleteBuild: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/builds/${id}`);
    return response.data;
  },

  // 检查组件兼容性
  checkCompatibility: async (components: { [key: string]: string }): Promise<ApiResponse<CompatibilityCheck>> => {
    const response = await api.post('/api/builds/check-compatibility', { components });
    return response.data;
  },

  // 保存构建配置
  saveBuild: async (buildData: BuildRequest): Promise<ApiResponse<BuildConfiguration>> => {
    const response = await api.post('/api/builds/save', buildData);
    return response.data;
  },
};

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  // 更新用户信息
  updateProfile: async (userData: any): Promise<ApiResponse<any>> => {
    const response = await api.put('/api/user/profile', userData);
    return response.data;
  },
};

export default api;
