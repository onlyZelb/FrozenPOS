package com.finalproject.frozenpos.Repository;

import com.finalproject.frozenpos.Entities.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
