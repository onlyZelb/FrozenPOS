package com.finalproject.frozenpos.Repository;

import com.finalproject.frozenpos.Entities.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;


public interface InventoryRepository extends JpaRepository<Inventory, Long> {}