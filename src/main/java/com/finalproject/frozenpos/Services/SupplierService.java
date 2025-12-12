package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SupplierDTO;
import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Entities.Supplier;
import com.finalproject.frozenpos.Repository.ProductRepository;
import com.finalproject.frozenpos.Repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public SupplierService(SupplierRepository supplierRepository, ProductRepository productRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    public Supplier findById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier save(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(dto.getSupplierName());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());

        if (dto.getProductIds() != null && !dto.getProductIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(dto.getProductIds());
            for (Product product : products) {
                product.setSupplier(supplier); // Assign supplier to product
            }
            supplier.setProducts(products);
        }

        return supplierRepository.save(supplier);
    }

    public Supplier update(Long id, SupplierDTO dto) {
        Optional<Supplier> optional = supplierRepository.findById(id);
        if (optional.isPresent()) {
            Supplier supplier = optional.get();
            supplier.setSupplierName(dto.getSupplierName());
            supplier.setPhoneNumber(dto.getPhoneNumber());
            supplier.setEmail(dto.getEmail());

            if (dto.getProductIds() != null) {
                // Clear old assignments first
                if (supplier.getProducts() != null) {
                    for (Product oldProduct : supplier.getProducts()) {
                        oldProduct.setSupplier(null);
                    }
                }
                // Assign new products
                List<Product> products = productRepository.findAllById(dto.getProductIds());
                for (Product product : products) {
                    product.setSupplier(supplier);
                }
                supplier.setProducts(products);
            }

            return supplierRepository.save(supplier);
        }
        return null;
    }

    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }
}
