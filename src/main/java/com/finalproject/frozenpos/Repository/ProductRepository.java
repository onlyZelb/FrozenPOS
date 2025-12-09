package com.finalproject.frozenpos.Repository;

import com.finalproject.frozenpos.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Long> {}
