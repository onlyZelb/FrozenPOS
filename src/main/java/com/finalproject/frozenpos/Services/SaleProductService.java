package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SaleProductDTO;
import com.finalproject.frozenpos.Entities.Product;
import com.finalproject.frozenpos.Entities.Sale;
import com.finalproject.frozenpos.Entities.SaleProduct;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.SaleProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleProductService {

    private final SaleProductRepository repository;

    public SaleProductService(SaleProductRepository repository) {
        this.repository = repository;
    }

    public List<SaleProduct> findAll() {
        return repository.findAll();
    }

    public SaleProduct findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SaleProduct with id " + id + " not found"));
    }

    public SaleProduct save(SaleProductDTO dto) {
        SaleProduct sp = new SaleProduct();

        Sale sale = new Sale();
        sale.setId(dto.getSaleId());
        sp.setSale(sale);

        Product product = new Product();
        product.setId(dto.getProductId());
        sp.setProduct(product);

        sp.setInvId(dto.getInvId());
        sp.setBasePrice(dto.getBasePrice());
        sp.setListPrice(dto.getListPrice());
        sp.setQuantity(dto.getQuantity());

        return repository.save(sp);
    }

    public SaleProduct update(Long id, SaleProductDTO dto) {
        SaleProduct sp = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SaleProduct with id " + id + " not found"));

        Sale sale = new Sale();
        sale.setId(dto.getSaleId());
        sp.setSale(sale);

        Product product = new Product();
        product.setId(dto.getProductId());
        sp.setProduct(product);

        sp.setInvId(dto.getInvId());
        sp.setBasePrice(dto.getBasePrice());
        sp.setListPrice(dto.getListPrice());
        sp.setQuantity(dto.getQuantity());

        return repository.save(sp);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
