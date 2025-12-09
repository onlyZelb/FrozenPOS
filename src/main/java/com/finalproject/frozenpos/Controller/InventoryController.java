package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.DTO.InventoryDTO;
import com.finalproject.frozenpos.Entities.Inventory;
import com.finalproject.frozenpos.Services.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Inventory> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Inventory getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Inventory create(@RequestBody InventoryDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody InventoryDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

