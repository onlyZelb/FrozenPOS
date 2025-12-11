package com.finalproject.frozenpos.Services; // Plural Services package

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;

@Service // Mark as a Service component
public class FileStorageServiceImpl implements FileStorageService {

    // Define the ROOT storage location (e.g., inside your project or on the server)
    private final Path rootLocation = Paths.get("src/main/resources/static/uploads"); 

    // Constructor to ensure the root directory exists
    public FileStorageServiceImpl() throws IOException {
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subdirectory, String customFileName) throws IOException {
        Path subdirectoryPath = rootLocation.resolve(subdirectory);
        if (!Files.exists(subdirectoryPath)) {
            Files.createDirectories(subdirectoryPath);
        }
        
        // Define the target path (e.g., /uploads/products/123.jpg)
        Path destinationFile = subdirectoryPath.resolve(customFileName);

        // Copy the file content
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the path relative to the static resources (for frontend access)
        return "/uploads/" + subdirectory + "/" + customFileName;
    }

    @Override
    public Path loadFile(String fileName, String subdirectory) {
        Path subdirectoryPath = rootLocation.resolve(subdirectory);
        return subdirectoryPath.resolve(fileName);
    }
}