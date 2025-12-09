package com.finalproject.frozenpos.Controller;



import com.finalproject.frozenpos.DTO.SaleProductDTO;
import com.finalproject.frozenpos.Entities.SaleProduct;
import com.finalproject.frozenpos.Services.SaleProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sale-products")
public class SaleProductController {

    private final SaleProductService service;

    public SaleProductController(SaleProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<SaleProduct> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SaleProduct getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public SaleProduct create(@RequestBody SaleProductDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public SaleProduct update(@PathVariable Long id, @RequestBody SaleProductDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}