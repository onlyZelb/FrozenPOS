package com.finalproject.frozenpos.Controller;

import com.finalproject.frozenpos.DTO.InventoryDTO;
import com.finalproject.frozenpos.Services.InventoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getAllInventory() {
        List<InventoryDTO> inventory = inventoryService.findAll();
        return ResponseEntity.ok(inventory);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InventoryDTO> getInventoryById(@PathVariable Long id) {
        InventoryDTO dto = inventoryService.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }
}