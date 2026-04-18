package com.marvelkitchen.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // Create Order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            
            // ✅ Fix: Handle amount properly (could be Integer or Double)
            Object amountObj = request.get("amount");
            int amount = 0;
            if (amountObj instanceof Integer) {
                amount = (Integer) amountObj * 100;
            } else if (amountObj instanceof Double) {
                amount = (int) (Math.round((Double) amountObj) * 100);
            } else if (amountObj instanceof BigDecimal) {
                amount = ((BigDecimal) amountObj).intValue() * 100;
            }
            
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            
            Order order = razorpay.orders.create(orderRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            
            System.out.println("✅ Order created: " + order.get("id"));
            
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            System.err.println("❌ Razorpay Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Verify Payment
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId = request.get("razorpay_order_id");
            String razorpayPaymentId = request.get("razorpay_payment_id");
            String razorpaySignature = request.get("razorpay_signature");
            
            System.out.println("🔍 Verifying payment - Order ID: " + razorpayOrderId);
            System.out.println("🔍 Payment ID: " + razorpayPaymentId);
            
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] digest = mac.doFinal(data.getBytes());
            String calculatedSignature = bytesToHex(digest);
            
            if (calculatedSignature.equals(razorpaySignature)) {
                System.out.println("✅ Payment verified successfully!");
                return ResponseEntity.ok(Map.of(
                    "success", true, 
                    "message", "Payment verified",
                    "paymentId", razorpayPaymentId
                ));
            } else {
                System.err.println("❌ Invalid signature");
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false, 
                    "message", "Invalid signature"
                ));
            }
        } catch (Exception e) {
            System.err.println("❌ Verification error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}