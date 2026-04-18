package com.marvelkitchen.service;

import com.marvelkitchen.entity.Product;
import com.marvelkitchen.entity.Category;
import com.marvelkitchen.repository.ProductRepository;
import com.marvelkitchen.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    // Get all available products
    public List<Product> getAllAvailableProducts() {
        return productRepository.findByIsAvailableTrue();
    }
    
    // Get all products (Admin)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    // ✅ ADD THIS METHOD - For dashboard stats
    public long getTotalProductsCount() {
        return productRepository.count();
    }
    
    // Get product by id
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found!"));
    }
    
    // Get products by category
    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found!"));
        return productRepository.findByCategoryAndIsAvailableTrue(category);
    }
    
    // Add new product (Admin)
    public Product addProduct(Product product) {
        product.setIsAvailable(true);
        return productRepository.save(product);
    }
    
    // Update product (Admin)
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setImageUrl(productDetails.getImageUrl());
        product.setIsVeg(productDetails.getIsVeg());
        return productRepository.save(product);
    }
    
    // Delete product (Admin)
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    // Toggle product availability (Admin)
    public Product toggleAvailability(Long id) {
        Product product = getProductById(id);
        product.setIsAvailable(!product.getIsAvailable());
        return productRepository.save(product);
    }
    
    // Search products
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
}