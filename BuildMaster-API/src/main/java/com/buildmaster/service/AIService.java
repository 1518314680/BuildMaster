package com.buildmaster.service;

import com.buildmaster.model.Component;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {
    
    private final ComponentService componentService;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${ai.provider:deepseek}")
    private String aiProvider;
    
    @Value("${ai.api-key}")
    private String apiKey;
    
    public Map<String, Object> getAIRecommendation(BigDecimal budget, String requirements) {
        // 获取所有可用配件
        List<Component> allComponents = componentService.getAllComponents();
        
        // 根据预算和需求进行简单的推荐逻辑
        Map<String, Object> recommendation = new HashMap<>();
        Map<String, String> components = new HashMap<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        
        // 简单的推荐算法（实际项目中应该调用真实的AI API）
        if (budget.compareTo(new BigDecimal("3000")) < 0) {
            // 入门级配置
            components.put("cpu", "Intel Core i3-12100F");
            components.put("gpu", "NVIDIA GTX 1650");
            components.put("motherboard", "MSI H610M PRO");
            components.put("ram", "Corsair Vengeance 8GB DDR4");
            components.put("case", "Cooler Master MasterBox Q300L");
            totalPrice = new BigDecimal("2800");
        } else if (budget.compareTo(new BigDecimal("6000")) < 0) {
            // 中端配置
            components.put("cpu", "Intel Core i5-13400F");
            components.put("gpu", "NVIDIA RTX 4060");
            components.put("motherboard", "MSI B760M PRO");
            components.put("ram", "Corsair Vengeance 16GB DDR4");
            components.put("case", "Fractal Design Core 1000");
            totalPrice = new BigDecimal("5500");
        } else {
            // 高端配置
            components.put("cpu", "Intel Core i7-13700F");
            components.put("gpu", "NVIDIA RTX 4070");
            components.put("motherboard", "MSI Z790-A PRO");
            components.put("ram", "Corsair Vengeance 32GB DDR5");
            components.put("case", "Fractal Design Define 7");
            totalPrice = new BigDecimal("8500");
        }
        
        recommendation.put("budget", budget);
        recommendation.put("requirements", requirements);
        recommendation.put("components", components);
        recommendation.put("totalPrice", totalPrice);
        recommendation.put("aiProvider", aiProvider);
        
        return recommendation;
    }
    
    private Map<String, Object> callDeepSeekAPI(BigDecimal budget, String requirements) {
        // 实际调用 DeepSeek API 的逻辑
        // 这里只是示例，需要根据实际API文档实现
        String apiUrl = "https://api.deepseek.com/v1/chat/completions";
        
        Map<String, Object> request = new HashMap<>();
        request.put("model", "deepseek-chat");
        request.put("messages", List.of(
            Map.of("role", "user", "content", 
                String.format("请根据预算 %s 元和需求 '%s' 推荐电脑配置", budget, requirements))
        ));
        
        // 实际项目中需要处理API调用和响应解析
        return new HashMap<>();
    }
}