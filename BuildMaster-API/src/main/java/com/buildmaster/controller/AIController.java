package com.buildmaster.controller;

import com.buildmaster.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {
    
    private final AIService aiService;
    
    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> getRecommendation(
            @RequestParam BigDecimal budget,
            @RequestParam String requirements) {
        
        Map<String, Object> recommendation = aiService.getAIRecommendation(budget, requirements);
        return ResponseEntity.ok(recommendation);
    }
    
    @PostMapping("/recommend-advanced")
    public ResponseEntity<Map<String, Object>> getAdvancedRecommendation(
            @RequestBody Map<String, Object> request) {
        
        BigDecimal budget = new BigDecimal(request.get("budget").toString());
        String requirements = request.get("requirements").toString();
        String useCase = request.getOrDefault("useCase", "").toString();
        String performanceLevel = request.getOrDefault("performanceLevel", "medium").toString();
        
        Map<String, Object> recommendation = aiService.getAIRecommendation(budget, requirements);
        
        // 添加额外的推荐信息
        recommendation.put("useCase", useCase);
        recommendation.put("performanceLevel", performanceLevel);
        recommendation.put("compatibility", "所有配件均兼容");
        recommendation.put("upgradePath", "支持后续升级");
        
        return ResponseEntity.ok(recommendation);
    }
}
