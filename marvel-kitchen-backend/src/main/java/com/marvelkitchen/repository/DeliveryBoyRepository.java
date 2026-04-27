package com.marvelkitchen.repository;

import com.marvelkitchen.entity.DeliveryBoy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryBoyRepository extends JpaRepository<DeliveryBoy, Long> {
    
    Optional<DeliveryBoy> findByEmail(String email);
    
    List<DeliveryBoy> findByIsAvailableTrue();
    
    boolean existsByEmail(String email);
}