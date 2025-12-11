package com.finalproject.frozenpos.Entities;

import jakarta.persistence.*;

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
    
    // Initialized to 0.0 to prevent null errors in frontend JSX
    @Column(name = "retail_price")
    private Double retailPrice = 0.0; 

    // Initialized to 0.0 to prevent null errors in frontend JSX
    @Column(name = "wholesale_price")
    private Double wholeSale = 0.0;   

    // Initialized to 0 to prevent null errors
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    // Initialized to 0
    @Column(name = "product_point")
    private Integer productPoint = 0;

    // Field required for image upload functionality
    @Column(name = "image_path")
    private String imagePath; 

    // --- Constructors ---
    public Product() {}

    // --- Getters and Setters ---

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
}