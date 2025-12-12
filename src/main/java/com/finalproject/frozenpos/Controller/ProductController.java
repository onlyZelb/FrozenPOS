package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.DTO.ProductDTO;
import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // --- CREATE Product with optional image ---
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @ModelAttribute ProductDTO productDto, 
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {

        Product newProduct = productService.save(productDto);

        if (file != null && !file.isEmpty()) {
            productService.saveProductImage(newProduct.getId(), file);
        }

        return ResponseEntity.status(201).body(newProduct);
    }

    // --- UPDATE Product with optional image ---
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @ModelAttribute ProductDTO productDto,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {

        Product updated = productService.update(id, productDto);

        if (file != null && !file.isEmpty()) {
            productService.saveProductImage(updated.getId(), file);
        }

        return ResponseEntity.ok(updated);
    }

    // --- GET ALL ---
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    // --- GET BY ID ---
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Product product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- UPLOAD IMAGE (optional separate endpoint) ---
    @PostMapping("/{id}/image")
    public ResponseEntity<Void> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        productService.saveProductImage(id, file);
        return ResponseEntity.ok().build();
    }
}
