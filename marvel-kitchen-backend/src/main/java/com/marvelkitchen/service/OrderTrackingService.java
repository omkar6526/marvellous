package com.marvelkitchen.service;

import com.marvelkitchen.entity.Order;
import com.marvelkitchen.entity.OrderStatusHistory;
import com.marvelkitchen.repository.OrderRepository;
import com.marvelkitchen.repository.OrderStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrderTrackingService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderStatusHistoryRepository historyRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    // Update order status and send real-time notification
    public void updateOrderStatus(Long orderId, String newStatus, String notes) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(Order.OrderStatus.valueOf(newStatus));
        
        // Set timestamps based on status
        if ("OUT_FOR_DELIVERY".equals(newStatus)) {
            order.setPickedUpAt(LocalDateTime.now());
        } else if ("DELIVERED".equals(newStatus)) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        orderRepository.save(order);
        
        // Save to history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(orderId);
        history.setStatus(newStatus);
        history.setNotes(notes);
        history.setCreatedAt(LocalDateTime.now());
        historyRepository.save(history);
        
        // Send WebSocket notification to customer
        Map<String, Object> notification = new HashMap<>();
        notification.put("orderId", orderId);
        notification.put("status", newStatus);
        notification.put("timestamp", LocalDateTime.now());
        notification.put("notes", notes);
        
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, notification);
    }
    
    // Assign delivery boy to order
    public void assignDeliveryBoy(Long orderId, Long deliveryBoyId, String deliveryBoyName, String deliveryBoyPhone) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setDeliveryBoyId(deliveryBoyId);
        order.setAssignedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        // Update status to CONFIRMED
        updateOrderStatus(orderId, "CONFIRMED", "Delivery boy assigned: " + deliveryBoyName);
        
        // Send delivery boy info to customer
        Map<String, Object> deliveryBoyInfo = new HashMap<>();
        deliveryBoyInfo.put("name", deliveryBoyName);
        deliveryBoyInfo.put("phone", deliveryBoyPhone);
        deliveryBoyInfo.put("orderId", orderId);
        
        messagingTemplate.convertAndSend("/topic/orders/" + orderId + "/delivery-boy", deliveryBoyInfo);
    }
    
    // Update delivery boy location
    public void updateDeliveryLocation(Long orderId, Double lat, Double lng) {
        Map<String, Object> location = new HashMap<>();
        location.put("orderId", orderId);
        location.put("lat", lat);
        location.put("lng", lng);
        location.put("timestamp", LocalDateTime.now());
        
        messagingTemplate.convertAndSend("/topic/orders/" + orderId + "/location", location);
    }
}