package com.marvelkitchen.controller;

import com.marvelkitchen.entity.DeliveryBoy;
import com.marvelkitchen.entity.Order;
import com.marvelkitchen.entity.Product;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.repository.OrderItemRepository;
import com.marvelkitchen.repository.OrderRepository;
import com.marvelkitchen.service.DeliveryBoyService;
import com.marvelkitchen.service.OrderService;
import com.marvelkitchen.service.ProductService;
import com.marvelkitchen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
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
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private DeliveryBoyService deliveryBoyService;
    
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
        List<Order> orders = orderService.getAllOrders();
        // Load delivery boy info for each order
        for (Order order : orders) {
            if (order.getDeliveryBoyId() != null) {
                try {
                    DeliveryBoy boy = deliveryBoyService.getDeliveryBoyById(order.getDeliveryBoyId());
                    order.setDeliveryBoy(boy);
                } catch (Exception e) {
                    // Ignore
                }
            }
        }
        return ResponseEntity.ok(orders);
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
    
    // ✅ Assign delivery boy to order
    @PutMapping("/orders/{orderId}/assign-delivery")
    public ResponseEntity<?> assignDeliveryBoy(@PathVariable Long orderId,
                                               @RequestParam Long deliveryBoyId) {
        try {
            Order order = orderRepository.findById(orderId).orElseThrow();
            DeliveryBoy boy = deliveryBoyService.getDeliveryBoyById(deliveryBoyId);
            
            order.setDeliveryBoyId(deliveryBoyId);
            order.setAssignedAt(LocalDateTime.now());
            if (order.getStatus() == Order.OrderStatus.PENDING) {
                order.setStatus(Order.OrderStatus.CONFIRMED);
            }
            orderRepository.save(order);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Delivery boy assigned successfully");
            response.put("deliveryBoy", boy.getName());
            response.put("orderId", orderId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // ✅ Get all delivery boys
    @GetMapping("/delivery-boys")
    public ResponseEntity<List<DeliveryBoy>> getAllDeliveryBoys() {
        List<DeliveryBoy> boys = deliveryBoyService.getAllDeliveryBoys();
        boys.forEach(boy -> boy.setPassword(null));
        return ResponseEntity.ok(boys);
    }
    
    // ✅ Get available delivery boys
    @GetMapping("/delivery-boys/available")
    public ResponseEntity<List<DeliveryBoy>> getAvailableDeliveryBoys() {
        List<DeliveryBoy> boys = deliveryBoyService.getAvailableDeliveryBoys();
        boys.forEach(boy -> boy.setPassword(null));
        return ResponseEntity.ok(boys);
    }
    
    // ✅ Add new delivery boy
    @PostMapping("/delivery-boys")
    public ResponseEntity<?> addDeliveryBoy(@RequestBody DeliveryBoy deliveryBoy) {
        try {
            DeliveryBoy saved = deliveryBoyService.addDeliveryBoy(deliveryBoy);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // ✅ Update delivery boy
    @PutMapping("/delivery-boys/{id}")
    public ResponseEntity<?> updateDeliveryBoy(@PathVariable Long id, @RequestBody DeliveryBoy deliveryBoy) {
        try {
            DeliveryBoy updated = deliveryBoyService.updateDeliveryBoy(id, deliveryBoy);
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // ✅ Delete delivery boy
    @DeleteMapping("/delivery-boys/{id}")
    public ResponseEntity<?> deleteDeliveryBoy(@PathVariable Long id) {
        try {
            deliveryBoyService.deleteDeliveryBoy(id);
            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("message", "Delivery boy deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // ✅ Toggle delivery boy availability (Online/Offline)
    @PutMapping("/delivery-boys/{id}/toggle")
    public ResponseEntity<?> toggleDeliveryBoyAvailability(@PathVariable Long id) {
        try {
            DeliveryBoy boy = deliveryBoyService.toggleAvailability(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isAvailable", boy.getIsAvailable());
            response.put("message", boy.getIsAvailable() ? "Delivery boy is now online" : "Delivery boy is now offline");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
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
            map.put("imageUrl", p.getImageUrl());
            map.put("image_url", p.getImageUrl());
            
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