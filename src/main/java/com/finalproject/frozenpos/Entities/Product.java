package com.finalproject.frozenpos.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    public Long productId;

    @Column(name = "product_name", nullable = false, length = 150)
    public String productName;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "retail_price", precision = 15, scale = 2)
    public BigDecimal retailPrice;

    @Column(name = "whole_sale", precision = 15, scale = 2)
    public BigDecimal wholeSale;

    @Column(name = "stock_quantity")
    public Integer stockQuantity;

    @Column(name = "product_point")
    public Integer productPoint;

    @OneToMany(mappedBy = "product")
    public List<SaleProduct> saleProducts;
}
