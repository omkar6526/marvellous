package com.marvelkitchen.service;

import com.marvelkitchen.entity.*;
import com.marvelkitchen.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductService productService;
    
    // Place new order - For COD and normal payments
    @Transactional
    public Order placeOrder(Long userId, String deliveryAddress, String phoneNumber, String paymentMethod) {
        User user = userService.findById(userId);
        
        // Get user's cart items
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(deliveryAddress);
        order.setPhoneNumber(phoneNumber);
        order.setPaymentMethod(Order.PaymentMethod.valueOf(paymentMethod));
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Add items to order
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            
            order.getItems().add(orderItem);
            
            totalAmount = totalAmount.add(cartItem.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        
        // Calculate totals
        order.setTotalAmount(totalAmount);
        
        BigDecimal deliveryCharge = totalAmount.compareTo(BigDecimal.valueOf(200)) > 0 ? 
            BigDecimal.ZERO : BigDecimal.valueOf(40);
        order.setDeliveryCharge(deliveryCharge);
        
        BigDecimal tax = totalAmount.multiply(BigDecimal.valueOf(0.05));
        order.setTax(tax);
        
        BigDecimal grandTotal = totalAmount.add(deliveryCharge).add(tax);
        order.setGrandTotal(grandTotal);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Clear user's cart
        cartItemRepository.deleteByUser(user);
        
        return savedOrder;
    }
    
    // ✅ NEW METHOD - Place order with Razorpay payment
    @Transactional
    public Order placeOrderWithRazorpay(Long userId, String deliveryAddress, String phoneNumber, 
                                        String paymentMethod, String razorpayPaymentId, 
                                        String razorpayOrderId, String razorpaySignature) {
        User user = userService.findById(userId);
        
        // Get user's cart items
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(deliveryAddress);
        order.setPhoneNumber(phoneNumber);
        order.setPaymentMethod(Order.PaymentMethod.valueOf(paymentMethod));
        
        // Store Razorpay details (if you have these fields in Order entity)
        // order.setRazorpayPaymentId(razorpayPaymentId);
        // order.setRazorpayOrderId(razorpayOrderId);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Add items to order
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            
            order.getItems().add(orderItem);
            
            totalAmount = totalAmount.add(cartItem.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        
        // Calculate totals
        order.setTotalAmount(totalAmount);
        
        BigDecimal deliveryCharge = totalAmount.compareTo(BigDecimal.valueOf(200)) > 0 ? 
            BigDecimal.ZERO : BigDecimal.valueOf(40);
        order.setDeliveryCharge(deliveryCharge);
        
        BigDecimal tax = totalAmount.multiply(BigDecimal.valueOf(0.05));
        order.setTax(tax);
        
        BigDecimal grandTotal = totalAmount.add(deliveryCharge).add(tax);
        order.setGrandTotal(grandTotal);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Clear user's cart
        cartItemRepository.deleteByUser(user);
        
        return savedOrder;
    }
    
    // Get user's orders
    public List<Order> getUserOrders(Long userId) {
        User user = userService.findById(userId);
        return orderRepository.findByUserOrderByOrderedAtDesc(user);
    }
    
    // Get order details
    public Order getOrderDetails(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found!"));
        
        // Check if order belongs to user or user is admin
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access!");
        }
        
        return order;
    }
    
    // Update order status (Admin)
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found!"));
        
        order.setStatus(Order.OrderStatus.valueOf(status));
        
        if (status.equals("DELIVERED")) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        return orderRepository.save(order);
    }
    
    // Get all orders (Admin)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    // Get pending orders (Admin)
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatus(Order.OrderStatus.PENDING);
    }
    
    // Get dashboard statistics (Admin)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalOrders", orderRepository.count());
        stats.put("pendingOrders", orderRepository.countByStatus(Order.OrderStatus.PENDING));
        stats.put("totalRevenue", orderRepository.getTotalRevenue() != null ? 
            orderRepository.getTotalRevenue() : 0.0);
        stats.put("todayRevenue", orderRepository.getTodayRevenue() != null ? 
            orderRepository.getTodayRevenue() : 0.0);
        stats.put("todayOrders", orderRepository.findTodayOrders().size());
        
        return stats;
    }
    
    // ✅ ADD THESE METHODS FOR ADMIN DASHBOARD
    
    // Get total orders count
    public long getTotalOrdersCount() {
        return orderRepository.count();
    }
    
    // Get pending orders count
    public long getPendingOrdersCount() {
        return orderRepository.countByStatus(Order.OrderStatus.PENDING);
    }
    
    // Get total revenue
    public double getTotalRevenue() {
        Double revenue = orderRepository.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }
    
    // Get today's orders count
    public long getTodayOrdersCount() {
        return orderRepository.findTodayOrders().size();
    }
    
    // Get today's revenue
    public double getTodayRevenue() {
        Double revenue = orderRepository.getTodayRevenue();
        return revenue != null ? revenue : 0.0;
    }
    
    // Get user orders by user ID (for admin)
    public List<Order> getUserOrdersByUserId(Long userId) {
        User user = userService.findById(userId);
        return orderRepository.findByUserOrderByOrderedAtDesc(user);
    }
}