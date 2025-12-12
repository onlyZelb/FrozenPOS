package com.finalproject.frozenpos.DTO;

import java.time.LocalDateTime;

public class InventoryDTO {

    private Long invId;
    private LocalDateTime lastUpdate;
    private Integer quantity;
    private String updatedBy;
    private Long productId;      // product ID
    private String productName;  // product name

    // Getters and Setters
    public Long getInvId() { return invId; }
    public void setInvId(Long invId) { this.invId = invId; }

    public LocalDateTime getLastUpdate() { return lastUpdate; }
    public void setLastUpdate(LocalDateTime lastUpdate) { this.lastUpdate = lastUpdate; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}
