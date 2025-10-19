package com.buildmaster.controller;

import com.buildmaster.model.Component;
import com.buildmaster.service.ComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/components")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComponentController {
    
    private final ComponentService componentService;
    
    @GetMapping
    public ResponseEntity<List<Component>> getAllComponents() {
        List<Component> components = componentService.getAllComponents();
        return ResponseEntity.ok(components);
    }
    
    @GetMapping("/page")
    public ResponseEntity<Page<Component>> getComponentsPage(Pageable pageable) {
        Page<Component> components = componentService.getComponentsPage(pageable);
        return ResponseEntity.ok(components);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Component>> getComponentsByType(@PathVariable Component.ComponentType type) {
        List<Component> components = componentService.getComponentsByType(type);
        return ResponseEntity.ok(components);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Component>> searchComponents(@RequestParam String keyword) {
        List<Component> components = componentService.searchComponents(keyword);
        return ResponseEntity.ok(components);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Component>> getComponentsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<Component> components = componentService.getComponentsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(components);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Component> getComponentById(@PathVariable Long id) {
        Optional<Component> component = componentService.getComponentById(id);
        return component.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Component> createComponent(@RequestBody Component component) {
        Component savedComponent = componentService.saveComponent(component);
        return ResponseEntity.ok(savedComponent);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Component> updateComponent(@PathVariable Long id, @RequestBody Component component) {
        component.setId(id);
        Component updatedComponent = componentService.saveComponent(component);
        return ResponseEntity.ok(updatedComponent);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComponent(@PathVariable Long id) {
        componentService.deleteComponent(id);
        return ResponseEntity.noContent().build();
    }
}
