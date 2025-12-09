package com.finalproject.frozenpos.Services;


import com.finalproject.frozenpos.DTO.SaleDTO;
import com.finalproject.frozenpos.Entities.Sale;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;

    public SaleService(SaleRepository repository) {
        this.repository = repository;
    }

    public List<Sale> findAll() {
        return repository.findAll();
    }

    public Sale findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale with id " + id + " not found"));
    }

    public Sale save(SaleDTO dto) {
        Sale sale = new Sale();
        sale.saleDateTime = dto.getSaleDateTime();
        sale.totalAmount = BigDecimal.valueOf(dto.getTotalAmount());
        sale.paymentMethod = dto.getPaymentMethod();
        sale.saleType = dto.getSaleType();
        return repository.save(sale);
    }

    public Sale update(Long id, SaleDTO dto) {
        Sale sale = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale with id " + id + " not found"));

        sale.saleDateTime = dto.getSaleDateTime();
        sale.totalAmount = BigDecimal.valueOf(dto.getTotalAmount());
        sale.paymentMethod = dto.getPaymentMethod();
        sale.saleType = dto.getSaleType();
        return repository.save(sale);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
