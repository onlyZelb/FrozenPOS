package com.finalproject.frozenpos.DTO;

import java.time.LocalDateTime;

public class SaleDTO {
    private Long saleId;
    private LocalDateTime saleDateTime;
    private Double totalAmount;
    private String paymentMethod;
    private String saleType;


    public Long getSaleId() { return saleId; }
    public void setSaleId(Long saleId) { this.saleId = saleId; }


    public LocalDateTime getSaleDateTime() { return saleDateTime; }
    public void setSaleDateTime(LocalDateTime saleDateTime) { this.saleDateTime = saleDateTime; }


    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }


    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }


    public String getSaleType() { return saleType; }
    public void setSaleType(String saleType) { this.saleType = saleType; }
}