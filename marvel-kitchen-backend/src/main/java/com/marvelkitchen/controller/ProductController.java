package com.marvelkitchen.controller;

import com.marvelkitchen.entity.Product;
import com.marvelkitchen.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public List<Map<String, Object>> getAllProducts() {
        System.out.println("GET /api/products called");
        List<Product> products = productService.getAllAvailableProducts();
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Product p : products) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("description", p.getDescription());
            map.put("price", p.getPrice());
            map.put("isVeg", p.getIsVeg());
            map.put("isAvailable", p.getIsAvailable());
            
            // Add category info safely
            if (p.getCategory() != null) {
                Map<String, Object> catMap = new HashMap<>();
                catMap.put("id", p.getCategory().getId());
                catMap.put("name", p.getCategory().getName());
                map.put("category", catMap);
            }
            response.add(map);
        }
        return response;
    }
}