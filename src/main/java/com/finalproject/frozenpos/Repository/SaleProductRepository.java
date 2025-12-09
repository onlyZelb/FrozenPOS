package com.finalproject.frozenpos.Repository;

import com.finalproject.frozenpos.Entities.SaleProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleProductRepository extends JpaRepository<SaleProduct, Long> {}