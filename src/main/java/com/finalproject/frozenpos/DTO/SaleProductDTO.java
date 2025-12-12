package com.finalproject.frozenpos.DTO;

public class SaleProductDTO {

    private Long productId;    // Matches frontend item.id
    private Integer quantity;  // Matches frontend item.quantity

    private Double basePrice;  // optional if you want to save
    private Double listPrice;  // optional if you want to save

    // Getters & Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Double getListPrice() { return listPrice; }
    public void setListPrice(Double listPrice) { this.listPrice = listPrice; }
}
