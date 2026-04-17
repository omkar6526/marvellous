package com.marvelkitchen.repository;

import com.marvelkitchen.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find active categories
    List<Category> findByIsActiveTrue();
    
    // Find category by name
    Optional<Category> findByName(String name);
}