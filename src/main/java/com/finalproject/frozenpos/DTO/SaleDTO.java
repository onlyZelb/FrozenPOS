package com.finalproject.frozenpos.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class SaleDTO {
    private String paymentMethod;
    private LocalDateTime saleDateTime;
    private String saleType;
    private Double totalAmount;
    private Double totalDiscount;
    private Long cashierId;
    private Boolean isVoided;
    private List<SaleProductDTO> saleProducts;

    // Getters and Setters
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getSaleDateTime() { return saleDateTime; }
    public void setSaleDateTime(LocalDateTime saleDateTime) { this.saleDateTime = saleDateTime; }

    public String getSaleType() { return saleType; }
    public void setSaleType(String saleType) { this.saleType = saleType; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getTotalDiscount() { return totalDiscount; }
    public void setTotalDiscount(Double totalDiscount) { this.totalDiscount = totalDiscount; }

    public Long getCashierId() { return cashierId; }
    public void setCashierId(Long cashierId) { this.cashierId = cashierId; }

    public Boolean getIsVoided() { return isVoided; }
    public void setIsVoided(Boolean isVoided) { this.isVoided = isVoided; }

    public List<SaleProductDTO> getSaleProducts() { return saleProducts; }
    public void setSaleProducts(List<SaleProductDTO> saleProducts) { this.saleProducts = saleProducts; }
}
