package com.marvelkitchen.controller;

import com.marvelkitchen.dto.OrderRequest;
import com.marvelkitchen.entity.Order;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.security.JwtUtil;
import com.marvelkitchen.service.OrderService;
import com.marvelkitchen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;  // 👈 Add this
    
    // Fix: Properly extract user ID from token
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
        
        Order order = orderService.placeOrder(userId, 
            request.getDeliveryAddress(), 
            request.getPhoneNumber(), 
            request.getPaymentMethod());
        
        // DON'T return order object directly - create simple response
        java.util.Map<String, Object> response = new java.util.HashMap<>();
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
        
        java.util.Map<String, String> errorResponse = new java.util.HashMap<>();
        errorResponse.put("success", "false");
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
    // Get user's orders
    @GetMapping("/myorders")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }
    
    // Get order details
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@RequestHeader("Authorization") String token,
                                             @PathVariable Long orderId) {
        try {
            Long userId = getUserIdFromToken(token);
            Order order = orderService.getOrderDetails(orderId, userId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(orderService.getDashboardStats());
    }
}