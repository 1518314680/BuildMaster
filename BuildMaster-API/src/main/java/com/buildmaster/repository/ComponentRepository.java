package com.buildmaster.repository;

import com.buildmaster.model.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentRepository extends JpaRepository<Component, Long> {
    
    List<Component> findByType(Component.ComponentType type);
    
    List<Component> findByIsAvailableTrue();
    
    List<Component> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT c FROM Component c WHERE c.type = :type AND c.isAvailable = true")
    List<Component> findAvailableByType(@Param("type") Component.ComponentType type);
    
    @Query("SELECT c FROM Component c WHERE c.price BETWEEN :minPrice AND :maxPrice AND c.isAvailable = true")
    List<Component> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, 
                                   @Param("maxPrice") java.math.BigDecimal maxPrice);
    
    @Query("SELECT c FROM Component c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Component> searchByKeyword(@Param("keyword") String keyword);
}
