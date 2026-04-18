package com.marvelkitchen.repository;

import com.marvelkitchen.entity.OrderItem;
import com.marvelkitchen.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Get items by order
    List<OrderItem> findByOrder(Order order);
    
    // Delete items by order
    void deleteByOrder(Order order);
    
    
    @Query("SELECT COUNT(o) > 0 FROM OrderItem o WHERE o.product.id = :productId")
    boolean existsByProductId(@Param("productId") Long productId);
    
    // Optional: Get count of orders for a product
    @Query("SELECT COUNT(o) FROM OrderItem o WHERE o.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);
}