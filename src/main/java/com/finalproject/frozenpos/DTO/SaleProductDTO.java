package com.finalproject.frozenpos.DTO;

public class SaleProductDTO {
    private Long saleProductId;
    private Long saleId;
    private Long productId;
    private Double basePrice;
    private Double listPrice;
    private Long inventoryId;


    public Long getSaleProductId() { return saleProductId; }
    public void setSaleProductId(Long saleProductId) { this.saleProductId = saleProductId; }


    public Long getSaleId() { return saleId; }
    public void setSaleId(Long saleId) { this.saleId = saleId; }


    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }


    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }


    public Double getListPrice() { return listPrice; }
    public void setListPrice(Double listPrice) { this.listPrice = listPrice; }


    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
}