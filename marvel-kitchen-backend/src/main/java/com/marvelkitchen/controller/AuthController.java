package com.marvelkitchen.controller;

import com.marvelkitchen.dto.LoginRequest;
import com.marvelkitchen.dto.LoginResponse;
import com.marvelkitchen.dto.RegisterRequest;
import com.marvelkitchen.entity.User;
import com.marvelkitchen.security.JwtUtil;
import com.marvelkitchen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                user.getPhone(),
                user.getAddress(),
                user.getId()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
    
 @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    try {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());  // ✅ PLAIN PASSWORD - NO ENCODING HERE
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        
        User savedUser = userService.registerUser(user);  // Service will encode
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        response.put("email", savedUser.getEmail());
        response.put("name", savedUser.getName());
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
    // ✅ ADD THIS ENDPOINT - To encrypt admin password
    @PostMapping("/fix-admin")
    public ResponseEntity<?> fixAdminPassword() {
        try {
            User admin = userService.findByEmail("admin@marvelkitchen.com")
                .orElse(null);
            
            if (admin == null) {
                admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@marvelkitchen.com");
                admin.setPhone("9876543210");
                admin.setAddress("Admin Address");
                admin.setRole(User.Role.ADMIN);
            }
            
            String encryptedPassword = passwordEncoder.encode("admin123");
            admin.setPassword(encryptedPassword);
            
            User savedAdmin = userService.save(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin password encrypted successfully!");
            response.put("email", "admin@marvelkitchen.com");
            response.put("password", "admin123");
            response.put("encrypted_password", encryptedPassword);
            response.put("role", savedAdmin.getRole());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin(@RequestBody LoginRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail())
                .orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("email", user.getEmail());
                response.put("name", user.getName());
                response.put("role", user.getRole().name());
                response.put("message", "Login successful!");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Invalid password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: " + e.getMessage());
        }
    }
}