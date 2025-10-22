package com.buildmaster.service;

import com.buildmaster.model.Component;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 京东开放平台API服务
 * 文档: https://union.jd.com/openplatform/
 * 
 * 注意: 需要先申请京东联盟账号和API权限
 */
@Slf4j
@Service
public class JDApiService {

    @Value("${jd.api.app-key:}")
    private String appKey;

    @Value("${jd.api.app-secret:}")
    private String appSecret;

    @Value("${jd.api.enabled:false}")
    private boolean apiEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 检查API是否已配置
     */
    public boolean isApiConfigured() {
        return apiEnabled && appKey != null && !appKey.isEmpty() 
               && appSecret != null && !appSecret.isEmpty();
    }

    /**
     * 根据关键词搜索商品
     * 
     * @param keyword 关键词（如: "Intel i7-13700K"）
     * @param pageSize 返回数量
     * @return 商品列表
     */
    @Cacheable(value = "jd-search", key = "#keyword + '-' + #pageSize")
    public List<Component> searchProducts(String keyword, int pageSize) {
        if (!isApiConfigured()) {
            log.warn("京东API未配置，返回空列表");
            return Collections.emptyList();
        }

        try {
            // 构建API请求参数
            Map<String, String> params = new HashMap<>();
            params.put("method", "jd.union.open.goods.query");
            params.put("app_key", appKey);
            params.put("timestamp", String.valueOf(System.currentTimeMillis()));
            params.put("format", "json");
            params.put("v", "1.0");
            params.put("sign_method", "md5");
            
            // 业务参数
            Map<String, Object> bizParams = new HashMap<>();
            bizParams.put("keyword", keyword);
            bizParams.put("pageSize", pageSize);
            bizParams.put("pageIndex", 1);
            
            params.put("360buy_param_json", toJsonString(bizParams));
            
            // 生成签名
            String sign = generateSign(params);
            params.put("sign", sign);
            
            // 发送请求（这里是示例，实际需要使用官方SDK）
            String url = "https://router.jd.com/api";
            log.info("调用京东API搜索: {}", keyword);
            
            // TODO: 实际调用API并解析响应
            // String response = restTemplate.getForObject(url + "?" + buildQueryString(params), String.class);
            // return parseSearchResponse(response);
            
            return Collections.emptyList();
            
        } catch (Exception e) {
            log.error("京东API搜索失败: {}", keyword, e);
            return Collections.emptyList();
        }
    }

    /**
     * 获取商品详情
     * 
     * @param skuId 京东商品ID
     * @return 配件信息
     */
    @Cacheable(value = "jd-product", key = "#skuId")
    public Component getProductDetail(String skuId) {
        if (!isApiConfigured()) {
            log.warn("京东API未配置");
            return null;
        }

        try {
            Map<String, String> params = new HashMap<>();
            params.put("method", "jd.union.open.goods.promotiongoodsinfo.query");
            params.put("app_key", appKey);
            params.put("timestamp", String.valueOf(System.currentTimeMillis()));
            params.put("format", "json");
            
            Map<String, Object> bizParams = new HashMap<>();
            bizParams.put("skuIds", Collections.singletonList(skuId));
            params.put("360buy_param_json", toJsonString(bizParams));
            
            String sign = generateSign(params);
            params.put("sign", sign);
            
            log.info("获取京东商品详情: {}", skuId);
            
            // TODO: 实际API调用
            return null;
            
        } catch (Exception e) {
            log.error("获取商品详情失败: {}", skuId, e);
            return null;
        }
    }

    /**
     * 获取商品价格
     * 
     * @param skuId 京东商品ID
     * @return 价格
     */
    @Cacheable(value = "jd-price", key = "#skuId")
    public BigDecimal getPrice(String skuId) {
        if (!isApiConfigured()) {
            return null;
        }

        try {
            // 价格查询API
            String url = String.format("https://p.3.cn/prices/mgets?skuIds=J_%s", skuId);
            
            log.info("查询京东价格: {}", skuId);
            
            // TODO: 实际API调用并解析
            // String response = restTemplate.getForObject(url, String.class);
            // return parsePriceResponse(response);
            
            return null;
            
        } catch (Exception e) {
            log.error("获取价格失败: {}", skuId, e);
            return null;
        }
    }

    /**
     * 批量更新价格
     * 
     * @param skuIds SKU ID列表
     * @return SKU ID -> 价格映射
     */
    public Map<String, BigDecimal> batchGetPrices(List<String> skuIds) {
        Map<String, BigDecimal> prices = new HashMap<>();
        
        if (!isApiConfigured() || skuIds == null || skuIds.isEmpty()) {
            return prices;
        }

        try {
            // 每次最多查询100个
            int batchSize = 100;
            for (int i = 0; i < skuIds.size(); i += batchSize) {
                int end = Math.min(i + batchSize, skuIds.size());
                List<String> batch = skuIds.subList(i, end);
                
                String skuIdsParam = batch.stream()
                    .map(id -> "J_" + id)
                    .collect(Collectors.joining(","));
                
                String url = "https://p.3.cn/prices/mgets?skuIds=" + skuIdsParam;
                
                log.info("批量查询价格: {} 个商品", batch.size());
                
                // TODO: 实际API调用并解析
                // String response = restTemplate.getForObject(url, String.class);
                // prices.putAll(parseBatchPriceResponse(response));
                
                // 避免频率限制
                if (i + batchSize < skuIds.size()) {
                    Thread.sleep(500);
                }
            }
        } catch (Exception e) {
            log.error("批量获取价格失败", e);
        }
        
        return prices;
    }

    /**
     * 生成API签名
     */
    private String generateSign(Map<String, String> params) {
        try {
            // 1. 参数排序
            String sortedParams = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + e.getValue())
                .collect(Collectors.joining());
            
            // 2. 拼接secret
            String signStr = appSecret + sortedParams + appSecret;
            
            // 3. MD5加密
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(signStr.getBytes("UTF-8"));
            
            // 4. 转大写hex
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02X", b));
            }
            
            return sb.toString();
            
        } catch (Exception e) {
            log.error("生成签名失败", e);
            return "";
        }
    }

    /**
     * 将Map转为JSON字符串（简化版）
     */
    private String toJsonString(Map<String, Object> map) {
        // 实际应该使用 Jackson 或 Gson
        StringBuilder json = new StringBuilder("{");
        
        map.forEach((key, value) -> {
            json.append("\"").append(key).append("\":");
            if (value instanceof String) {
                json.append("\"").append(value).append("\"");
            } else if (value instanceof List) {
                json.append("[");
                List<?> list = (List<?>) value;
                for (int i = 0; i < list.size(); i++) {
                    if (i > 0) json.append(",");
                    json.append("\"").append(list.get(i)).append("\"");
                }
                json.append("]");
            } else {
                json.append(value);
            }
            json.append(",");
        });
        
        if (json.charAt(json.length() - 1) == ',') {
            json.setLength(json.length() - 1);
        }
        
        json.append("}");
        return json.toString();
    }

    /**
     * 构建查询字符串
     */
    private String buildQueryString(Map<String, String> params) {
        return params.entrySet().stream()
            .map(e -> e.getKey() + "=" + e.getValue())
            .collect(Collectors.joining("&"));
    }
}


