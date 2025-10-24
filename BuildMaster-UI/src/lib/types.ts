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
  // 京东相关字段
  jdSkuId?: string;              // 京东商品ID
  purchaseUrl?: string;          // 京东购买链接（联盟推广链接）
  priceUpdatedAt?: string;       // 价格更新时间
  originalPrice?: number;        // 原价
  commissionRate?: number;       // 佣金比例
  imageUrl?: string;             // 图片URL（后端字段名）
  description?: string;          // 商品描述
  isAvailable?: boolean;         // 是否可用
  stockQuantity?: number;        // 库存数量
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
