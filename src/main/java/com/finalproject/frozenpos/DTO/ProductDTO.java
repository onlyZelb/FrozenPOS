package com.finalproject.frozenpos.DTO;

import java.math.BigDecimal;

public class ProductDTO {

    private Long productId;
    private String productName;
    private String description;
    private BigDecimal retailPrice;
    private BigDecimal wholeSale;
    private Integer stockQuantity;
    private Integer productPoint;

    public ProductDTO() {}

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getRetailPrice() {
        return retailPrice;
    }

    public void setRetailPrice(BigDecimal retailPrice) {
        this.retailPrice = retailPrice;
    }

    public BigDecimal getWholeSale() {
        return wholeSale;
    }

    public void setWholeSale(BigDecimal wholeSale) {
        this.wholeSale = wholeSale;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getProductPoint() {
        return productPoint;
    }

    public void setProductPoint(Integer productPoint) {
        this.productPoint = productPoint;
    }
}
