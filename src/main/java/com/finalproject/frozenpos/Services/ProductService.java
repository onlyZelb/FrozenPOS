package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.ProductRepository;
import com.finalproject.frozenpos.DTO.ProductDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final String uploadDir = "src/main/resources/static/images/products/";

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    // --- GET ALL PRODUCTS ---
    @Transactional
    public List<Product> findAll() {
        return repository.findAll();
    }

    // --- GET PRODUCT BY ID ---
    @Transactional
    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + id + " not found"));
    }

    // --- CREATE PRODUCT ---
    @Transactional
    public Product save(ProductDTO dto) {
        Product product = toEntity(dto);
        return repository.save(product);
    }

    // --- UPDATE PRODUCT ---
    @Transactional
    public Product update(Long id, ProductDTO dto) {
        Product existing = findById(id);

        existing.setProductName(dto.getProductName());
        existing.setDescription(dto.getDescription());
        existing.setProductPoint(dto.getProductPoint());
        existing.setRetailPrice(dto.getRetailPrice());
        existing.setWholeSale(dto.getWholeSale());
        existing.setStockQuantity(dto.getStockQuantity());

        return repository.save(existing);
    }

    // --- DELETE PRODUCT ---
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // --- SAVE PRODUCT IMAGE ---
    @Transactional
    public void saveProductImage(Long productId, MultipartFile file) throws IOException {
        Product product = findById(productId);

        Path copyLocation = Paths.get(uploadDir + productId);
        Files.createDirectories(copyLocation);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot > 0) {
            extension = originalFilename.substring(lastDot);
        }
        String newFileName = productId + extension;

        Path filePath = copyLocation.resolve(newFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String relativePath = "/images/products/" + productId + "/" + newFileName;
        product.setImagePath(relativePath);
        repository.save(product);
    }

    // --- Convert DTO to Entity ---
    private Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setRetailPrice(dto.getRetailPrice());
        product.setWholeSale(dto.getWholeSale());
        product.setStockQuantity(dto.getStockQuantity());
        product.setProductPoint(dto.getProductPoint());
        return product;
    }

    // --- POS: Decrease stock safely ---
    @Transactional
    public void decreaseStock(Long productId, int quantity) {
        Product product = findById(productId);
        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;

        if (quantity > currentStock) {
            throw new IllegalArgumentException(
                "Cannot process sale: not enough stock for product " + product.getProductName()
            );
        }

        product.setStockQuantity(currentStock - quantity);
        repository.save(product);
    }

    // --- Inventory: Adjust stock (positive or negative) ---
    @Transactional
    public void adjustStock(Long productId, int quantityChange) {
        Product product = findById(productId);
        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
        int newStock = currentStock + quantityChange;

        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot go below 0 for product " + product.getProductName());
        }

        product.setStockQuantity(newStock);
        repository.save(product);
    }
}
