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
    
    // Get orders by user
    List<Order> findByUserOrderByOrderedAtDesc(User user);
    
    // Get orders by status
    List<Order> findByStatus(Order.OrderStatus status);
    
    // Get orders between dates
    List<Order> findByOrderedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Get today's orders
    @Query("SELECT o FROM Order o WHERE DATE(o.orderedAt) = CURRENT_DATE")
    List<Order> findTodayOrders();
    
    // Get order by orderId
    Optional<Order> findByOrderId(String orderId);
    
    // Count orders by status
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") Order.OrderStatus status);
    
    // Get total revenue
    @Query("SELECT SUM(o.grandTotal) FROM Order o WHERE o.status = 'DELIVERED'")
    Double getTotalRevenue();
    
    // Get today's revenue
    @Query("SELECT SUM(o.grandTotal) FROM Order o WHERE DATE(o.orderedAt) = CURRENT_DATE AND o.status = 'DELIVERED'")
    Double getTodayRevenue();
}