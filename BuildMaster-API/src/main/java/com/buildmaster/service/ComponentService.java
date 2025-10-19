package com.buildmaster.service;

import com.buildmaster.model.Component;
import com.buildmaster.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComponentService {
    
    private final ComponentRepository componentRepository;
    
    public List<Component> getAllComponents() {
        return componentRepository.findByIsAvailableTrue();
    }
    
    @Cacheable(value = "components", key = "#type")
    public List<Component> getComponentsByType(Component.ComponentType type) {
        return componentRepository.findAvailableByType(type);
    }
    
    public List<Component> searchComponents(String keyword) {
        return componentRepository.searchByKeyword(keyword);
    }
    
    public List<Component> getComponentsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return componentRepository.findByPriceRange(minPrice, maxPrice);
    }
    
    public Optional<Component> getComponentById(Long id) {
        return componentRepository.findById(id);
    }
    
    public Component saveComponent(Component component) {
        return componentRepository.save(component);
    }
    
    public void deleteComponent(Long id) {
        componentRepository.deleteById(id);
    }
    
    public Page<Component> getComponentsPage(Pageable pageable) {
        return componentRepository.findAll(pageable);
    }
}
