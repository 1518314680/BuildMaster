"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";

interface AIRecommendation {
  budget: number;
  requirements: string;
  components: {
    cpu: string;
    gpu: string;
    motherboard: string;
    ram: string;
    case: string;
  };
  totalPrice: number;
}

export default function AIAssistantPage() {
  const [budget, setBudget] = useState<number>(5000);
  const [requirements, setRequirements] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  const handleGetRecommendation = async () => {
    setIsLoading(true);
    try {
      // 模拟 AI 推荐 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟推荐结果
      const mockRecommendation: AIRecommendation = {
        budget,
        requirements,
        components: {
          cpu: "Intel Core i5-13400F",
          gpu: "NVIDIA RTX 4060",
          motherboard: "MSI B760M PRO",
          ram: "Corsair Vengeance 16GB DDR4",
          case: "Fractal Design Core 1000"
        },
        totalPrice: budget * 0.95
      };
      
      setRecommendation(mockRecommendation);
    } catch (error) {
      console.error("获取推荐失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">🤖 AI 装机助手</h1>
          <p className="text-gray-300">告诉我您的预算和需求，我来为您推荐最佳配置</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-6">配置需求</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">预算范围 (元)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入预算"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">使用需求</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  placeholder="例如：游戏、办公、视频剪辑、3D建模等..."
                />
              </div>

              <button
                onClick={handleGetRecommendation}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isLoading ? "AI 分析中..." : "获取推荐配置"}
              </button>
            </div>
          </motion.div>

          {/* 推荐结果 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-6">推荐配置</h2>
            
            {recommendation ? (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">💻 处理器</h3>
                  <p className="text-gray-300">{recommendation.components.cpu}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🎮 显卡</h3>
                  <p className="text-gray-300">{recommendation.components.gpu}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🔌 主板</h3>
                  <p className="text-gray-300">{recommendation.components.motherboard}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">💾 内存</h3>
                  <p className="text-gray-300">{recommendation.components.ram}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">📦 机箱</h3>
                  <p className="text-gray-300">{recommendation.components.case}</p>
                </div>
                
                <div className="bg-blue-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">💰 总价</h3>
                  <p className="text-2xl font-bold">¥{recommendation.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <div className="text-6xl mb-4">🤖</div>
                <p>填写您的需求，获取 AI 推荐配置</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
