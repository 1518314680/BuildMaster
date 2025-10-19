"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface Component {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  specifications: {
    [key: string]: string;
  };
}

interface BuildConfig {
  id: string;
  name: string;
  components: Component[];
  totalPrice: number;
  createdAt: string;
}

export default function ConfigPage() {
  const params = useParams();
  const configId = params.id as string;
  const [config, setConfig] = useState<BuildConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟从 API 获取配置数据
    const fetchConfig = async () => {
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟配置数据
        const mockConfig: BuildConfig = {
          id: configId,
          name: "游戏配置单",
          components: [
            {
              id: "1",
              name: "Intel Core i5-13400F",
              type: "CPU",
              price: 1299,
              image: "/images/cpu.png",
              specifications: {
                "核心数": "10核16线程",
                "基础频率": "2.5GHz",
                "最大睿频": "4.6GHz",
                "TDP": "65W"
              }
            },
            {
              id: "2",
              name: "NVIDIA RTX 4060",
              type: "GPU",
              price: 2399,
              image: "/images/gpu.png",
              specifications: {
                "显存": "8GB GDDR6",
                "核心频率": "1830MHz",
                "显存位宽": "128-bit",
                "功耗": "115W"
              }
            },
            {
              id: "3",
              name: "MSI B760M PRO",
              type: "Motherboard",
              price: 699,
              image: "/images/motherboard.png",
              specifications: {
                "芯片组": "Intel B760",
                "内存插槽": "4个DDR4",
                "PCIe插槽": "1个PCIe 4.0 x16",
                "存储接口": "4个SATA 6Gb/s"
              }
            },
            {
              id: "4",
              name: "Corsair Vengeance 16GB",
              type: "RAM",
              price: 399,
              image: "/images/ram.png",
              specifications: {
                "容量": "16GB (2x8GB)",
                "频率": "DDR4-3200",
                "时序": "CL16",
                "电压": "1.35V"
              }
            },
            {
              id: "5",
              name: "Fractal Design Core 1000",
              type: "Case",
              price: 299,
              image: "/images/case.png",
              specifications: {
                "类型": "中塔式机箱",
                "主板支持": "Micro-ATX",
                "硬盘位": "2个3.5寸",
                "风扇位": "2个120mm"
              }
            }
          ],
          totalPrice: 5095,
          createdAt: "2024-01-15T10:30:00Z"
        };
        
        setConfig(mockConfig);
      } catch (error) {
        console.error("获取配置失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [configId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>加载配置中...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">配置不存在</h1>
          <p className="text-gray-400">请检查配置ID是否正确</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{config.name}</h1>
          <p className="text-gray-400">创建时间: {new Date(config.createdAt).toLocaleDateString()}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 配置列表 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">配件清单</h2>
            <div className="space-y-4">
              {config.components.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={component.image}
                      alt={component.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{component.name}</h3>
                      <p className="text-gray-400 mb-3">{component.type}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(component.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">¥{component.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 配置摘要 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 p-6 rounded-lg sticky top-8"
            >
              <h3 className="text-2xl font-semibold mb-6">配置摘要</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>配件数量:</span>
                  <span>{config.components.length} 件</span>
                </div>
                <div className="flex justify-between">
                  <span>总价格:</span>
                  <span className="text-2xl font-bold text-green-400">¥{config.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  保存配置
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  开始装机
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  分享配置
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}