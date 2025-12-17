package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.DTO.SupplierDTO;
import com.finalproject.frozenpos.Entities.Supplier;
import com.finalproject.frozenpos.Services.SupplierService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Supplier>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        Supplier supplier = service.findById(id);
        return ResponseEntity.ok(supplier);
    }

    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody SupplierDTO dto) {
        Supplier supplier = service.save(dto);
        return ResponseEntity.ok(supplier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(@PathVariable Long id, @RequestBody SupplierDTO dto) {
        Supplier supplier = service.update(id, dto);
        return ResponseEntity.ok(supplier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
