package com.marvelkitchen.controller;

import com.marvelkitchen.entity.Order;
import com.marvelkitchen.entity.Product;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.repository.OrderItemRepository;
import com.marvelkitchen.service.OrderService;
import com.marvelkitchen.service.ProductService;
import com.marvelkitchen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orderService.getTotalOrdersCount());
        stats.put("pendingOrders", orderService.getPendingOrdersCount());
        stats.put("totalRevenue", orderService.getTotalRevenue());
        stats.put("totalUsers", userService.getTotalUsersCount());
        stats.put("totalProducts", productService.getTotalProductsCount());
        stats.put("todayOrders", orderService.getTodayOrdersCount());
        stats.put("todayRevenue", orderService.getTodayRevenue());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, 
                                                @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // ✅ FIXED: Return Map with imageUrl field
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Product p : products) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("description", p.getDescription());
            map.put("price", p.getPrice());
            map.put("isVeg", p.getIsVeg());
            map.put("isAvailable", p.getIsAvailable());
            map.put("rating", p.getRating());
            map.put("imageUrl", p.getImageUrl());  // ✅ Frontend expects imageUrl
            map.put("image_url", p.getImageUrl()); // ✅ Also add underscore version
            
            // Add category info
            if (p.getCategory() != null) {
                Map<String, Object> catMap = new HashMap<>();
                catMap.put("id", p.getCategory().getId());
                catMap.put("name", p.getCategory().getName());
                map.put("category", catMap);
            }
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            product.setIsAvailable(true);
            Product savedProduct = productService.addProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/products/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId, 
                                           @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(productId, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        try {
            boolean hasOrders = orderItemRepository.existsByProductId(productId);
            
            if (hasOrders) {
                Product product = productService.getProductById(productId);
                product.setIsAvailable(false);
                productService.updateProduct(productId, product);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("action", "disabled");
                response.put("message", "Product has existing orders. It has been hidden from menu.");
                response.put("productId", productId);
                return ResponseEntity.ok(response);
            } else {
                productService.deleteProduct(productId);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("action", "deleted");
                response.put("message", "Product deleted successfully");
                response.put("productId", productId);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/products/{productId}/toggle")
    public ResponseEntity<?> toggleProductAvailability(@PathVariable Long productId) {
        try {
            Product product = productService.toggleAvailability(productId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isAvailable", product.getIsAvailable());
            response.put("message", product.getIsAvailable() ? "Product enabled" : "Product disabled");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}