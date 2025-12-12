package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SaleDTO;
import com.finalproject.frozenpos.DTO.SaleProductDTO;
import com.finalproject.frozenpos.Entities.Sale;
import com.finalproject.frozenpos.Entities.SaleProduct;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final SaleProductService saleProductService;

    public SaleService(SaleRepository repository, SaleProductService saleProductService) {
        this.repository = repository;
        this.saleProductService = saleProductService;
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
        sale.setPaymentMethod(dto.getPaymentMethod());
        sale.setSaleDateTime(dto.getSaleDateTime());
        sale.setSaleType(dto.getSaleType());
        sale.setTotalAmount(dto.getTotalAmount());
        sale.setTotalDiscount(dto.getTotalDiscount());
        sale.setCashierId(dto.getCashierId());
        sale.setIsVoided(dto.getIsVoided());

        List<SaleProduct> saleProducts = new ArrayList<>();
        if (dto.getSaleProducts() != null) {
            for (SaleProductDTO spDto : dto.getSaleProducts()) {
                saleProducts.add(saleProductService.save(spDto));
            }
        }
        sale.setSaleProducts(saleProducts);

        return repository.save(sale);
    }

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

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
