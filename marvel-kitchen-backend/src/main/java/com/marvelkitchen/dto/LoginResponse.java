package com.marvelkitchen.dto;

public class LoginResponse {
    private String token;
    private String email;
    private String name;
    private String role;
    private String phone;
    private String address;
    private Long id;
    
    // Constructor with all fields
    public LoginResponse(String token, String email, String name, String role, String phone, String address, Long id) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.phone = phone;
        this.address = address;
        this.id = id;
    }
    
    // Overloaded constructor for backward compatibility
    public LoginResponse(String token, String email, String name, String role) {
        this(token, email, name, role, null, null, null);
    }
    
    // Getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public Long getId() { return id; }
    
    // Setters
    public void setToken(String token) { this.token = token; }
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setRole(String role) { this.role = role; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAddress(String address) { this.address = address; }
    public void setId(Long id) { this.id = id; }
}