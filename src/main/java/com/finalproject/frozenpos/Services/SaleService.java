package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SaleDTO;
import com.finalproject.frozenpos.DTO.SaleProductDTO;
import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Entities.Sale;
import com.finalproject.frozenpos.Entities.SaleProduct;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.ProductRepository;
import com.finalproject.frozenpos.Repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final ProductRepository productRepository;

    public SaleService(SaleRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    // --- Get all sales ---
    public List<Sale> findAll() {
        return repository.findAll();
    }

    // --- Get sale by ID ---
    public Sale findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale with id " + id + " not found"));
    }

    // --- Create sale with proper stock deduction ---
    @Transactional
    public Sale save(SaleDTO dto) {
        // Validate input
        if (dto.getSaleProducts() == null || dto.getSaleProducts().isEmpty()) {
            throw new IllegalArgumentException("No products in the sale.");
        }
        if (dto.getCashierId() == null) {
            throw new IllegalArgumentException("Cashier ID is required.");
        }

        Sale sale = new Sale();
        sale.setPaymentMethod(dto.getPaymentMethod());
        sale.setSaleDateTime(dto.getSaleDateTime());
        sale.setSaleType(dto.getSaleType());
        sale.setTotalAmount(dto.getTotalAmount());
        sale.setTotalDiscount(dto.getTotalDiscount());
        sale.setCashierId(dto.getCashierId());
        sale.setIsVoided(dto.getIsVoided());

        List<SaleProduct> saleProducts = new ArrayList<>();

        for (SaleProductDTO spDto : dto.getSaleProducts()) {
            if (spDto.getQuantity() == null || spDto.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero for all products.");
            }

            // Fetch product
            Product product = productRepository.findById(spDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + spDto.getProductId()));

            // Deduct stock
            int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            int newStock = currentStock - spDto.getQuantity();
            if (newStock < 0) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getProductName());
            }
            product.setStockQuantity(newStock);
            productRepository.save(product);

            // Create SaleProduct and link to Sale
            SaleProduct sp = new SaleProduct();
            sp.setSale(sale);                // crucial: link SaleProduct to Sale
            sp.setProduct(product);
            sp.setQuantity(spDto.getQuantity());
            sp.setBasePrice(product.getWholeSale());
            sp.setListPrice(product.getRetailPrice());
            saleProducts.add(sp);
        }

        sale.setSaleProducts(saleProducts);

        // Save Sale (cascades SaleProducts)
        return repository.save(sale);
    }

    // --- Update existing sale (only metadata, not saleProducts) ---
    @Transactional
    public Sale update(Long id, SaleDTO dto) {
        Sale sale = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale with id " + id + " not found"));

        sale.setPaymentMethod(dto.getPaymentMethod());
        sale.setSaleDateTime(dto.getSaleDateTime());
        sale.setSaleType(dto.getSaleType());
        sale.setTotalAmount(dto.getTotalAmount());
        sale.setTotalDiscount(dto.getTotalDiscount());
        sale.setCashierId(dto.getCashierId());
        sale.setIsVoided(dto.getIsVoided());

        return repository.save(sale);
    }

    // --- Delete sale ---
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
