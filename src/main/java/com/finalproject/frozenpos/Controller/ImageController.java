package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.Services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final FileStorageService fileStorageService;

    @Autowired
    public ImageController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Serves images saved by the application.
     * Example URL: /api/images/products/123.jpg
     */
    @GetMapping("/{subdirectory}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String subdirectory, 
            @PathVariable String filename) {
        
        Path filePath = fileStorageService.loadFile(filename, subdirectory);
        Resource resource = null; // You would typically load the Resource here
        
        try {
            resource = new org.springframework.core.io.UrlResource(filePath.toUri());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Customize media type as needed
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}