package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.DTO.SupplierDTO;
import com.finalproject.frozenpos.Entities.Supplier;
import com.finalproject.frozenpos.Services.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    @GetMapping
    public List<Supplier> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Supplier create(@RequestBody SupplierDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody SupplierDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
