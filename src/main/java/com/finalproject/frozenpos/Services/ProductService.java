package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.ProductDTO;
import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + id + " not found"));
    }

    public Product save(ProductDTO dto) {
        Product product = new Product();
        product.productName = dto.getProductName();
        product.description = dto.getDescription();
        product.retailPrice = dto.getRetailPrice();
        product.wholeSale = dto.getWholeSale();
        product.stockQuantity = dto.getStockQuantity();
        product.productPoint = dto.getProductPoint();
        return repository.save(product);
    }

    public Product update(Long id, ProductDTO dto) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + id + " not found"));

        product.productName = dto.getProductName();
        product.description = dto.getDescription();
        product.retailPrice = dto.getRetailPrice();
        product.wholeSale = dto.getWholeSale();
        product.stockQuantity = dto.getStockQuantity();
        product.productPoint = dto.getProductPoint();
        return repository.save(product);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
