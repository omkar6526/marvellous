package com.marvelkitchen.service;


import com.marvelkitchen.entity.CartItem;
import com.marvelkitchen.entity.Product;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.repository.CartItemRepository;
import com.marvelkitchen.repository.ProductRepository;
import com.marvelkitchen.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;  // 👈 JwtUtil inject karo
    
    // Helper method to get user from token
    private User getUserFromToken(String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtUtil.extractEmail(jwt);
        return userService.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found!"));
    }
    
    // Get user's cart - FIXED (token se user find karega)
    public List<CartItem> getUserCart(String token) {
        User user = getUserFromToken(token);
        return cartItemRepository.findByUser(user);
    }
    
    // Add item to cart - FIXED (token se user find karega)
    public CartItem addToCart(String token, Long productId, Integer quantity) {
        User user = getUserFromToken(token);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found!"));
        
        // Check if item already in cart
        CartItem existingItem = cartItemRepository.findByUserAndProduct(user, product).orElse(null);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            return cartItemRepository.save(cartItem);
        }
    }
    
    // Update cart item quantity
    public CartItem updateQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found!"));
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }
    
    // Remove item from cart - FIXED (token se user find karega)
// Remove item from cart - FIXED with proper logging
@Transactional
public void removeFromCart(String token, Long productId) {
    try {
        User user = getUserFromToken(token);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found!"));
        
        // Check if item exists before deleting
        Optional<CartItem> cartItem = cartItemRepository.findByUserAndProduct(user, product);
        if (cartItem.isEmpty()) {
            throw new RuntimeException("Item not found in cart!");
        }
        
        // Delete the item
        cartItemRepository.deleteByUserAndProduct(user, product);
        
        // Verify deletion
        Optional<CartItem> deleted = cartItemRepository.findByUserAndProduct(user, product);
        if (deleted.isPresent()) {
            throw new RuntimeException("Failed to delete item!");
        }
        
    } catch (Exception e) {
        throw new RuntimeException("Error removing from cart: " + e.getMessage());
    }
}
    
    // Clear user's cart - FIXED (token se user find karega)
    public void clearCart(String token) {
        User user = getUserFromToken(token);
        cartItemRepository.deleteByUser(user);
    }
}