package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SaleProductDTO;
import com.finalproject.frozenpos.Entities.Inventory;
import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Entities.Sale;
import com.finalproject.frozenpos.Entities.SaleProduct;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.InventoryRepository;
import com.finalproject.frozenpos.Repository.ProductRepository;
import com.finalproject.frozenpos.Repository.SaleProductRepository;
import com.finalproject.frozenpos.Repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SaleProductService {

    private final SaleProductRepository repository;
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public SaleProductService(SaleProductRepository repository, SaleRepository saleRepository,
                              ProductRepository productRepository, InventoryRepository inventoryRepository) {
        this.repository = repository;
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<SaleProduct> findAll() {
        return repository.findAll();
    }

    public SaleProduct findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SaleProduct with id " + id + " not found"));
    }

    public SaleProduct save(SaleProductDTO dto) {
        Sale sale = saleRepository.findById(dto.getSaleId())
                .orElseThrow(() -> new ResourceNotFoundException("Sale with id " + dto.getSaleId() + " not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + dto.getProductId() + " not found"));
        Inventory inventory = inventoryRepository.findById(dto.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory with id " + dto.getInventoryId() + " not found"));

        SaleProduct sp = new SaleProduct();
        sp.sale = sale;
        sp.product = product;
        sp.inventory = inventory;
        sp.basePrice = BigDecimal.valueOf(dto.getBasePrice());
        sp.listPrice = BigDecimal.valueOf(dto.getListPrice());

        return repository.save(sp);
    }

    public SaleProduct update(Long id, SaleProductDTO dto) {
        SaleProduct sp = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SaleProduct with id " + id + " not found"));

        Sale sale = saleRepository.findById(dto.getSaleId())
                .orElseThrow(() -> new ResourceNotFoundException("Sale with id " + dto.getSaleId() + " not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product with id " + dto.getProductId() + " not found"));
        Inventory inventory = inventoryRepository.findById(dto.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory with id " + dto.getInventoryId() + " not found"));

        sp.sale = sale;
        sp.product = product;
        sp.inventory = inventory;
        sp.basePrice = BigDecimal.valueOf(dto.getBasePrice());
        sp.listPrice = BigDecimal.valueOf(dto.getListPrice());

        return repository.save(sp);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
