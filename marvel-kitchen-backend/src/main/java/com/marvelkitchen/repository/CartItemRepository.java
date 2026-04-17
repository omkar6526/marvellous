package com.marvelkitchen.repository;

import com.marvelkitchen.entity.CartItem;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Get user's cart
    List<CartItem> findByUser(User user);
    
    // Find specific item in cart
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    
    // Delete user's cart items
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c WHERE c.user = :user")
    void deleteByUser(@Param("user") User user);
    
    // Delete specific cart item - FIXED VERSION
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c WHERE c.user = :user AND c.product = :product")
    void deleteByUserAndProduct(@Param("user") User user, @Param("product") Product product);
    
    // Alternative: Delete by ID (better approach)
    @Modifying
    @Transactional
    void deleteById(Long id);
    
    // Count items in cart
    int countByUser(User user);
}