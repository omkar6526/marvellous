package com.marvelkitchen.service;

import com.marvelkitchen.entity.DeliveryBoy;
import com.marvelkitchen.repository.DeliveryBoyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DeliveryBoyService {
    
    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<DeliveryBoy> getAllDeliveryBoys() {
        return deliveryBoyRepository.findAll();
    }
    
    public List<DeliveryBoy> getAvailableDeliveryBoys() {
        return deliveryBoyRepository.findByIsAvailableTrue();
    }
    
    public DeliveryBoy getDeliveryBoyById(Long id) {
        return deliveryBoyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Delivery boy not found with id: " + id));
    }
    
    public DeliveryBoy getDeliveryBoyByEmail(String email) {
        return deliveryBoyRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Delivery boy not found with email: " + email));
    }
    
    public DeliveryBoy addDeliveryBoy(DeliveryBoy deliveryBoy) {
        if (deliveryBoy.getPassword() != null && !deliveryBoy.getPassword().isEmpty()) {
            deliveryBoy.setPassword(passwordEncoder.encode(deliveryBoy.getPassword()));
        }
        return deliveryBoyRepository.save(deliveryBoy);
    }
    
    public DeliveryBoy updateDeliveryBoy(Long id, DeliveryBoy updatedBoy) {
        DeliveryBoy boy = getDeliveryBoyById(id);
        boy.setName(updatedBoy.getName());
        boy.setPhone(updatedBoy.getPhone());
        boy.setEmail(updatedBoy.getEmail());
        boy.setVehicleType(updatedBoy.getVehicleType());
        if (updatedBoy.getPassword() != null && !updatedBoy.getPassword().isEmpty()) {
            boy.setPassword(passwordEncoder.encode(updatedBoy.getPassword()));
        }
        return deliveryBoyRepository.save(boy);
    }
    
    public void deleteDeliveryBoy(Long id) {
        deliveryBoyRepository.deleteById(id);
    }
    
    public DeliveryBoy toggleAvailability(Long id) {
        DeliveryBoy boy = getDeliveryBoyById(id);
        boy.setIsAvailable(!boy.getIsAvailable());
        return deliveryBoyRepository.save(boy);
    }
}