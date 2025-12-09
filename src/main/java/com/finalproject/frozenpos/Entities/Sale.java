package com.finalproject.frozenpos.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    public Long saleId;

    @Column(name = "sale_date_time", nullable = false)
    public LocalDateTime saleDateTime;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    public BigDecimal totalAmount;

    @Column(name = "payment_method", length = 50)
    public String paymentMethod;

    @Column(name = "sale_type", length = 50)
    public String saleType;

    @OneToMany(mappedBy = "sale")
    public List<SaleProduct> saleProducts;
}