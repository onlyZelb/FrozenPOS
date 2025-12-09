package com.finalproject.frozenpos.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventories")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inv_id")
    public Long invId;

    @Column(nullable = false)
    public Integer quantity;

    @Column(name = "last_update")
    public LocalDateTime lastUpdate;

    @Column(name = "updated_by", length = 100)
    public String updatedBy;
}