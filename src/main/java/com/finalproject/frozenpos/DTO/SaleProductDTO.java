package com.finalproject.frozenpos.DTO;

public class SaleProductDTO {
    private Long saleId;
    private Long productId;
    private Long invId;
    private Double basePrice;
    private Double listPrice;
    private Integer quantity;

    // Getters and Setters
    public Long getSaleId() { return saleId; }
    public void setSaleId(Long saleId) { this.saleId = saleId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getInvId() { return invId; }
    public void setInvId(Long invId) { this.invId = invId; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Double getListPrice() { return listPrice; }
    public void setListPrice(Double listPrice) { this.listPrice = listPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
