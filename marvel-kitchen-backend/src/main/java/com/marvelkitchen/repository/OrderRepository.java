package com.marvelkitchen.repository;

import com.marvelkitchen.entity.Order;
import com.marvelkitchen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserOrderByOrderedAtDesc(User user);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByDeliveryBoyId(Long deliveryBoyId);
    
    List<Order> findByDeliveryBoyIdAndStatusIn(Long deliveryBoyId, List<String> statuses);
    
    List<Order> findByOrderedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT o FROM Order o WHERE DATE(o.orderedAt) = CURRENT_DATE")
    List<Order> findTodayOrders();
    
    Optional<Order> findByOrderId(String orderId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT SUM(o.grandTotal) FROM Order o WHERE o.status = 'DELIVERED'")
    Double getTotalRevenue();
    
    @Query("SELECT SUM(o.grandTotal) FROM Order o WHERE DATE(o.orderedAt) = CURRENT_DATE AND o.status = 'DELIVERED'")
    Double getTodayRevenue();
}