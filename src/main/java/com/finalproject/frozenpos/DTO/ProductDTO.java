package com.finalproject.frozenpos.DTO; // STICKING TO YOUR CASE (Uppercase DTO)

public class ProductDTO {

    // Note: DTOs often exclude the ID for creation, but include it for updates/reads
    private Long id;
    private String productName;
    private String description;
    private Double retailPrice;
    private Double wholeSale;
    private Integer stockQuantity;
    private Integer productPoint;

    // --- Getters and Setters (Standard Java) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getRetailPrice() { return retailPrice; }
    public void setRetailPrice(Double retailPrice) { this.retailPrice = retailPrice; }

    public Double getWholeSale() { return wholeSale; }
    public void setWholeSale(Double wholeSale) { this.wholeSale = wholeSale; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getProductPoint() { return productPoint; }
    public void setProductPoint(Integer productPoint) { this.productPoint = productPoint; }
}