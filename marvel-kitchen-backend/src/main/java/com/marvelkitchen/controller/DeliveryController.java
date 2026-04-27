package com.marvelkitchen.controller;

import com.marvelkitchen.entity.Order;
import com.marvelkitchen.repository.OrderRepository;
import com.marvelkitchen.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveryController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderService orderService;
    
    // Get all orders assigned to this delivery boy
    @GetMapping("/orders")
    public ResponseEntity<?> getDeliveryOrders(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // TODO: Extract delivery boy ID from token properly
            // For now, use 1L (change this to actual ID from your system)
            Long deliveryBoyId = getDeliveryBoyIdFromToken(token);
            
            List<Order> orders = orderRepository.findByDeliveryBoyId(deliveryBoyId);
            
            if (orders == null || orders.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            
            // Remove sensitive info if needed
            orders.forEach(order -> {
                if (order.getUser() != null) {
                    order.getUser().setPassword(null);
                }
            });
            
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch orders: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Get single order details
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            // Remove sensitive info
            if (order.getUser() != null) {
                order.getUser().setPassword(null);
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Update order status by delivery boy
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, 
                                                @RequestParam String status) {
        try {
            // Use existing orderService method
            Order order = orderService.updateOrderStatus(orderId, status);
            
            // Set timestamps based on status
            if ("OUT_FOR_DELIVERY".equals(status)) {
                order.setPickedUpAt(java.time.LocalDateTime.now());
                orderRepository.save(order);
            } else if ("DELIVERED".equals(status)) {
                order.setDeliveredAt(java.time.LocalDateTime.now());
                orderRepository.save(order);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order status updated to " + status);
            response.put("orderId", orderId);
            response.put("status", status);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Mark order as delivered
    @PostMapping("/orders/{orderId}/deliver")
    public ResponseEntity<?> markAsDelivered(@PathVariable Long orderId) {
        try {
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            // Use existing orderService method
            orderService.updateOrderStatus(orderId, "DELIVERED");
            order.setDeliveredAt(java.time.LocalDateTime.now());
            orderRepository.save(order);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order marked as delivered");
            response.put("orderId", orderId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Get delivery boy's active order (current delivery)
    @GetMapping("/active-order")
    public ResponseEntity<?> getActiveOrder(@RequestHeader("Authorization") String token) {
        try {
            Long deliveryBoyId = getDeliveryBoyIdFromToken(token);
            
            List<Order> activeOrders = orderRepository.findByDeliveryBoyIdAndStatusIn(
                deliveryBoyId, 
                List.of("CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY")
            );
            
            if (activeOrders.isEmpty()) {
                return ResponseEntity.ok(null);
            }
            
            return ResponseEntity.ok(activeOrders.get(0));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Helper method to get delivery boy ID from token
    private Long getDeliveryBoyIdFromToken(String token) {
        // TODO: Implement proper token extraction
        // For now, return a default ID (you should map this to actual delivery boy)
        // You can store delivery boy ID in JWT token or a separate table
        
        // Temporary - get from localStorage or from a mapping
        // In production, you should have a DeliveryBoy entity and extract from token
        return 1L;
    }
}