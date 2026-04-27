package com.marvelkitchen.controller;

import com.marvelkitchen.service.OrderTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class LocationWebSocketController {
    
    @Autowired
    private OrderTrackingService trackingService;
    
    @MessageMapping("/location/update")
    public void updateLocation(@Payload Map<String, Object> locationData) {
        Long orderId = Long.valueOf(locationData.get("orderId").toString());
        Double lat = Double.valueOf(locationData.get("lat").toString());
        Double lng = Double.valueOf(locationData.get("lng").toString());
        
        trackingService.updateDeliveryLocation(orderId, lat, lng);
    }
}