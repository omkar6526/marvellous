package com.marvelkitchen.controller;

import com.marvelkitchen.entity.CartItem;
import com.marvelkitchen.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    // Get user's cart - UPDATED with image_url
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCart(@RequestHeader("Authorization") String token) {
        List<CartItem> cartItems = cartService.getUserCart(token);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (CartItem item : cartItems) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", item.getId());
            itemMap.put("quantity", item.getQuantity());
            
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", item.getProduct().getId());
            productMap.put("name", item.getProduct().getName());
            productMap.put("description", item.getProduct().getDescription());
            productMap.put("price", item.getProduct().getPrice());
            productMap.put("isVeg", item.getProduct().getIsVeg());
            productMap.put("isAvailable", item.getProduct().getIsAvailable());
            productMap.put("rating", item.getProduct().getRating());
            productMap.put("image_url", item.getProduct().getImageUrl());  // ✅ IMPORTANT!
            
            if (item.getProduct().getCategory() != null) {
                Map<String, Object> catMap = new HashMap<>();
                catMap.put("id", item.getProduct().getCategory().getId());
                catMap.put("name", item.getProduct().getCategory().getName());
                productMap.put("category", catMap);
            }
            
            itemMap.put("product", productMap);
            response.add(itemMap);
        }
        
        return ResponseEntity.ok(response);
    }
    
    // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String token,
                                       @RequestBody Map<String, Object> request) {
        try {
            Long productId = Long.valueOf(request.get("productId").toString());
            Integer quantity = (Integer) request.getOrDefault("quantity", 1);
            
            CartItem cartItem = cartService.addToCart(token, productId, quantity);
            
            // Return with product details including image_url
            Map<String, Object> response = new HashMap<>();
            response.put("id", cartItem.getId());
            response.put("quantity", cartItem.getQuantity());
            
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", cartItem.getProduct().getId());
            productMap.put("name", cartItem.getProduct().getName());
            productMap.put("price", cartItem.getProduct().getPrice());
            productMap.put("isVeg", cartItem.getProduct().getIsVeg());
            productMap.put("image_url", cartItem.getProduct().getImageUrl());
            
            response.put("product", productMap);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Update cart item quantity
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartItemId,
                                            @RequestBody Map<String, Integer> request) {
        try {
            CartItem cartItem = cartService.updateQuantity(cartItemId, request.get("quantity"));
            return ResponseEntity.ok(cartItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Remove item from cart
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@RequestHeader("Authorization") String token,
                                            @PathVariable Long productId) {
        try {
            cartService.removeFromCart(token, productId);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Clear cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String token) {
        try {
            cartService.clearCart(token);
            return ResponseEntity.ok("Cart cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}