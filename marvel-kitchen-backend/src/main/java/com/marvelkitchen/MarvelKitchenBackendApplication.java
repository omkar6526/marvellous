package com.marvelkitchen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarvelKitchenBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MarvelKitchenBackendApplication.class, args);
        System.out.println("🚀 Marvel Kitchen Backend Started on port 8080!");
    }
}