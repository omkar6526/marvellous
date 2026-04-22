package com.marvelkitchen.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {
    
    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Directly save to React's public folder
            String reactImagesPath = "../marvel-kitchen-frontend/public/images/products/";
            Path uploadPath = Paths.get(reactImagesPath);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // ✅ Use original file name (remove spaces for web safety)
            String originalFilename = file.getOriginalFilename();
            
            // Remove spaces and special characters from file name
            String cleanFileName = originalFilename
                .replaceAll("[^a-zA-Z0-9.-]", "-")  // Replace special chars with hyphen
                .replaceAll("-+", "-");              // Replace multiple hyphens with single hyphen
            
            Path filePath = uploadPath.resolve(cleanFileName);
            
            // If file already exists, add number suffix
            int counter = 1;
            while (Files.exists(filePath)) {
                String nameWithoutExt = cleanFileName.substring(0, cleanFileName.lastIndexOf("."));
                String extension = cleanFileName.substring(cleanFileName.lastIndexOf("."));
                String newName = nameWithoutExt + "-" + counter + extension;
                filePath = uploadPath.resolve(newName);
                cleanFileName = newName;
                counter++;
            }
            
            Files.copy(file.getInputStream(), filePath);
            
            // Return URL that React can access
            String imageUrl = "/images/products/" + cleanFileName;
            
            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}