package com.marvelkitchen.controller;

import com.marvelkitchen.dto.OrderRequest;
import com.marvelkitchen.entity.DeliveryBoy;
import com.marvelkitchen.entity.Order;
import com.marvelkitchen.entity.OrderItem;
import com.marvelkitchen.entity.OrderStatusHistory;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.security.JwtUtil;
import com.marvelkitchen.service.DeliveryBoyService;
import com.marvelkitchen.service.OrderService;
import com.marvelkitchen.service.UserService;
import com.marvelkitchen.repository.OrderStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private DeliveryBoyService deliveryBoyService;
    
    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;
    
    private Long getUserIdFromToken(String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtUtil.extractEmail(jwt);
        User user = userService.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found!"));
        return user.getId();
    }
    
    // Place new order
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestHeader("Authorization") String token,
                                        @RequestBody OrderRequest request) {
        try {
            System.out.println("=== PLACE ORDER ===");
            
            Long userId = getUserIdFromToken(token);
            System.out.println("User ID: " + userId);
            System.out.println("Address: " + request.getDeliveryAddress());
            System.out.println("Phone: " + request.getPhoneNumber());
            System.out.println("Payment: " + request.getPaymentMethod());
            
            if ("RAZORPAY".equals(request.getPaymentMethod())) {
                System.out.println("Razorpay Payment ID: " + request.getRazorpayPaymentId());
                System.out.println("Razorpay Order ID: " + request.getRazorpayOrderId());
            }
            
            Order order;
            
            if ("RAZORPAY".equals(request.getPaymentMethod())) {
                order = orderService.placeOrderWithRazorpay(
                    userId,
                    request.getDeliveryAddress(),
                    request.getPhoneNumber(),
                    request.getPaymentMethod(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpayOrderId(),
                    request.getRazorpaySignature()
                );
            } else {
                order = orderService.placeOrder(
                    userId,
                    request.getDeliveryAddress(),
                    request.getPhoneNumber(),
                    request.getPaymentMethod()
                );
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully!");
            response.put("orderId", order.getId());
            response.put("orderNumber", order.getOrderId());
            response.put("grandTotal", order.getGrandTotal());
            response.put("status", order.getStatus().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("success", "false");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user's orders - UPDATED with image_url in order items
    @GetMapping("/myorders")
    public ResponseEntity<List<Map<String, Object>>> getMyOrders(@RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        List<Order> orders = orderService.getUserOrders(userId);
        
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Order order : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("orderId", order.getOrderId());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("deliveryCharge", order.getDeliveryCharge());
            orderMap.put("tax", order.getTax());
            orderMap.put("grandTotal", order.getGrandTotal());
            orderMap.put("status", order.getStatus().toString());
            orderMap.put("paymentMethod", order.getPaymentMethod());
            orderMap.put("deliveryAddress", order.getDeliveryAddress());
            orderMap.put("phoneNumber", order.getPhoneNumber());
            orderMap.put("orderedAt", order.getOrderedAt());
            orderMap.put("deliveredAt", order.getDeliveredAt());
            
            // Process order items with image_url
            List<Map<String, Object>> itemsList = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("productId", item.getProduct().getId());
                itemMap.put("productName", item.getProductName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getPrice());
                itemMap.put("imageUrl", item.getProduct().getImageUrl());
                
                itemsList.add(itemMap);
            }
            orderMap.put("items", itemsList);
            
            response.add(orderMap);
        }
        
        return ResponseEntity.ok(response);
    }
    
    // Get order details - UPDATED with image_url
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@RequestHeader("Authorization") String token,
                                             @PathVariable Long orderId) {
        try {
            Long userId = getUserIdFromToken(token);
            Order order = orderService.getOrderDetails(orderId, userId);
            
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("orderId", order.getOrderId());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("deliveryCharge", order.getDeliveryCharge());
            orderMap.put("tax", order.getTax());
            orderMap.put("grandTotal", order.getGrandTotal());
            orderMap.put("status", order.getStatus().toString());
            orderMap.put("paymentMethod", order.getPaymentMethod());
            orderMap.put("deliveryAddress", order.getDeliveryAddress());
            orderMap.put("phoneNumber", order.getPhoneNumber());
            orderMap.put("orderedAt", order.getOrderedAt());
            orderMap.put("deliveredAt", order.getDeliveredAt());
            
            List<Map<String, Object>> itemsList = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("productId", item.getProduct().getId());
                itemMap.put("productName", item.getProductName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getPrice());
                itemMap.put("imageUrl", item.getProduct().getImageUrl());
                
                itemsList.add(itemMap);
            }
            orderMap.put("items", itemsList);
            
            return ResponseEntity.ok(orderMap);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ✅ NEW ENDPOINT - Order tracking with delivery boy details
    @GetMapping("/{orderId}/track")
    public ResponseEntity<?> getOrderTrackingInfo(@PathVariable Long orderId,
                                                   @RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            
            // Fetch order
            Order order = orderService.getOrderDetails(orderId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("order", order);
            response.put("status", order.getStatus().toString());
            
            // ✅ Add delivery boy details if assigned
            if (order.getDeliveryBoyId() != null) {
                try {
                    DeliveryBoy boy = deliveryBoyService.getDeliveryBoyById(order.getDeliveryBoyId());
                    Map<String, Object> boyMap = new HashMap<>();
                    boyMap.put("id", boy.getId());
                    boyMap.put("name", boy.getName());
                    boyMap.put("phone", boy.getPhone());
                    boyMap.put("rating", boy.getRating());
                    boyMap.put("vehicleType", boy.getVehicleType());
                    boyMap.put("totalDeliveries", boy.getTotalDeliveries());
                    response.put("deliveryBoy", boyMap);
                } catch (Exception e) {
                    response.put("deliveryBoy", null);
                }
            }
            
            // Add status history
            List<OrderStatusHistory> history = orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
            response.put("statusHistory", history);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
    
    // ========== ADMIN ONLY APIs ==========
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getPendingOrders() {
        return ResponseEntity.ok(orderService.getPendingOrders());
    }
    
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(orderId, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order status updated successfully");
            response.put("status", order.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(orderService.getDashboardStats());
    }
}