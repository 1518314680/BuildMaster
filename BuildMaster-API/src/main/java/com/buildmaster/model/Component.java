package com.buildmaster.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "components")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Component {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComponentType type;
    
    private String brand;
    
    private String model;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "specifications", columnDefinition = "JSON")
    private String specifications;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @Column(name = "jd_sku_id")
    private String jdSkuId;  // 京东商品ID，用于价格更新
    
    @Column(name = "specs", columnDefinition = "TEXT")
    private String specs;  // 规格说明（简化版）
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ComponentType {
        CPU, GPU, MOTHERBOARD, MEMORY, STORAGE, CASE, POWER_SUPPLY, COOLER
    }
}
