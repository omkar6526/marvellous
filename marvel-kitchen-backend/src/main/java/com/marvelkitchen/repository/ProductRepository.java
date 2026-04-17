package com.marvelkitchen.repository;

import com.marvelkitchen.entity.Product;
import com.marvelkitchen.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find available products
    List<Product> findByIsAvailableTrue();
    
    // Find products by category
    List<Product> findByCategory(Category category);
    
    // Find products by category and availability
    List<Product> findByCategoryAndIsAvailableTrue(Category category);
    
    // Search products by name
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find veg/non-veg products
    List<Product> findByIsVeg(Boolean isVeg);
    
}