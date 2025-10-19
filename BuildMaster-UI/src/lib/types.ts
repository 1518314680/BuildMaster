// 类型定义文件

export interface Component {
  id: string;
  name: string;
  type: ComponentType;
  brand: string;
  model: string;
  price: number;
  image: string;
  specifications: Record<string, any>;
  compatibility?: string[];
}

export type ComponentType = 
  | 'cpu' 
  | 'gpu' 
  | 'motherboard' 
  | 'ram' 
  | 'storage' 
  | 'psu' 
  | 'case' 
  | 'cooler';

export interface BuildConfiguration {
  id: string;
  name: string;
  components: {
    [K in ComponentType]?: Component;
  };
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  builds: BuildConfiguration[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BuildRequest {
  components: {
    [K in ComponentType]?: string; // component IDs
  };
}

export interface CompatibilityCheck {
  compatible: boolean;
  issues: string[];
  warnings: string[];
}
