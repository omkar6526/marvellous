package com.marvelkitchen.dto;

public class OrderRequest {
    private String deliveryAddress;
    private String phoneNumber;
    private String paymentMethod;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    
    // Default constructor
    public OrderRequest() {}
    
    // Constructor for COD
    public OrderRequest(String deliveryAddress, String phoneNumber, String paymentMethod) {
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.paymentMethod = paymentMethod;
    }
    
    // Constructor for Razorpay
    public OrderRequest(String deliveryAddress, String phoneNumber, String paymentMethod, 
                        String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.paymentMethod = paymentMethod;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpaySignature = razorpaySignature;
    }
    
    // Getters and Setters
    public String getDeliveryAddress() {
        return deliveryAddress;
    }
    
    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }
    
    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }
    
    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }
    
    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }
    
    public String getRazorpaySignature() {
        return razorpaySignature;
    }
    
    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}