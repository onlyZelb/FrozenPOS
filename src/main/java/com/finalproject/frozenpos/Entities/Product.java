package com.finalproject.frozenpos.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "description")
    private String description;

    @Column(name = "retail_price")
    private Double retailPrice = 0.0;

    @Column(name = "wholesale_price")
    private Double wholeSale = 0.0;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "product_point")
    private Integer productPoint = 0;

    @Column(name = "image_path")
    private String imagePath;

    // --- Link to Supplier ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    @JsonBackReference  // Prevent circular JSON serialization
    private Supplier supplier;

    // --- Constructors ---
    public Product() {}

    // --- Getters & Setters ---
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

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }
}
