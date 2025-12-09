package com.finalproject.frozenpos.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sale_products")
public class SaleProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_product_id")
    public Long saleProductId;

    @ManyToOne
    @JoinColumn(name = "sale_id", nullable = false)
    public Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    public Product product;

    @Column(name = "base_price", precision = 15, scale = 2)
    public BigDecimal basePrice;

    @Column(name = "list_price", precision = 15, scale = 2)
    public BigDecimal listPrice;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    public Inventory inventory;
}