package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.InventoryDTO;
import com.finalproject.frozenpos.Entities.Inventory;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.InventoryRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository repository;

    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    public List<Inventory> findAll() {
        return repository.findAll();
    }

    public Inventory findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory with id " + id + " not found"));
    }

    public Inventory save(InventoryDTO dto) {
        Inventory inventory = new Inventory();
        inventory.quantity = dto.getQuantity();
        inventory.lastUpdate = dto.getLastUpdate();
        inventory.updatedBy = dto.getUpdatedBy();
        return repository.save(inventory);
    }

    public Inventory update(Long id, InventoryDTO dto) {
        Inventory inventory = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory with id " + id + " not found"));

        inventory.quantity = dto.getQuantity();
        inventory.lastUpdate = dto.getLastUpdate();
        inventory.updatedBy = dto.getUpdatedBy();
        return repository.save(inventory);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
