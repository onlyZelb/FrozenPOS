package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.InventoryDTO;
import com.finalproject.frozenpos.Entities.Inventory;
import com.finalproject.frozenpos.Repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Crucial for JPA/500 fix

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional // FIXED: Allows lazy loading of Product inside toDTO
    public List<InventoryDTO> findAll() {
        return inventoryRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional // FIXED: Allows lazy loading of Product inside toDTO
    public InventoryDTO findById(Long id) {
        return inventoryRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    private InventoryDTO toDTO(Inventory inventory) {
        InventoryDTO dto = new InventoryDTO();
        dto.setInvId(inventory.getId());
        dto.setQuantity(inventory.getQuantity());
        dto.setLastUpdate(inventory.getLastUpdate());
        dto.setUpdatedBy(inventory.getUpdatedBy());

        // This requires the session to be open, hence @Transactional
        if (inventory.getProduct() != null) { 
            dto.setProductId(inventory.getProduct().getId());
            dto.setProductName(inventory.getProduct().getProductName());
        } else {
            dto.setProductId(null);
            dto.setProductName("N/A");
        }

        return dto;
    }
}