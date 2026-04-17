package com.marvelkitchen.repository;

import com.marvelkitchen.entity.OrderItem;
import com.marvelkitchen.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Get items by order
    List<OrderItem> findByOrder(Order order);
    
    // Delete items by order
    void deleteByOrder(Order order);
}