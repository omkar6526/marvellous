package com.marvelkitchen.service;

import com.marvelkitchen.entity.User;
import com.marvelkitchen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found!"));
    }
    
    public User updateProfile(Long userId, User updatedUser) {
        User user = findById(userId);
        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        return userRepository.save(user);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public User updateUserProfile(Long userId, String name, String phone, String address) {
        User user = findById(userId);
        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }
        if (phone != null && !phone.isEmpty()) {
            user.setPhone(phone);
        }
        if (address != null && !address.isEmpty()) {
            user.setAddress(address);
        }
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Remove passwords for security
        users.forEach(user -> user.setPassword(null));
        return users;
    }
    
    // ✅ ADD THIS METHOD - For dashboard stats
    public long getTotalUsersCount() {
        return userRepository.count();
    }
    
    // ✅ ADD THIS METHOD - To fix/create admin user
    public User createOrUpdateAdmin() {
        Optional<User> existingAdmin = findByEmail("admin@marvelkitchen.com");
        
        User admin;
        if (existingAdmin.isPresent()) {
            admin = existingAdmin.get();
            // Update existing admin
            admin.setName("Admin");
            admin.setRole(User.Role.ADMIN);
            admin.setPhone("9876543210");
            admin.setAddress("Admin Address");
        } else {
            // Create new admin
            admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@marvelkitchen.com");
            admin.setPhone("9876543210");
            admin.setAddress("Admin Address");
            admin.setRole(User.Role.ADMIN);
        }
        
        // Set encrypted password for "admin123"
        admin.setPassword(passwordEncoder.encode("admin123"));
        
        return userRepository.save(admin);
    }
}