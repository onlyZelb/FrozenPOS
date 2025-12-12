package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.DTO.SaleDTO;
import com.finalproject.frozenpos.Entities.Sale;
import com.finalproject.frozenpos.Services.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Sale> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Sale getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Sale create(@RequestBody SaleDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public Sale update(@PathVariable Long id, @RequestBody SaleDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
