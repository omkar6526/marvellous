package com.marvelkitchen.controller;

import com.marvelkitchen.entity.CartItem;
import com.marvelkitchen.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    // Get user's cart
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(cartService.getUserCart(token));
    }
    
    // Add item to cart - FIXED
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String token,
                                       @RequestBody Map<String, Object> request) {
        try {
            Long productId = Long.valueOf(request.get("productId").toString());
            Integer quantity = (Integer) request.getOrDefault("quantity", 1);
            
            // 👈 FIXED: token pass kar raha hu (String), productId, quantity
            CartItem cartItem = cartService.addToCart(token, productId, quantity);
            return ResponseEntity.ok(cartItem);
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
    
    // Remove item from cart - FIXED
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@RequestHeader("Authorization") String token,
                                            @PathVariable Long productId) {
        try {
            // 👈 FIXED: token pass kar raha hu
            cartService.removeFromCart(token, productId);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Clear cart - FIXED
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String token) {
        try {
            // 👈 FIXED: token pass kar raha hu
            cartService.clearCart(token);
            return ResponseEntity.ok("Cart cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}