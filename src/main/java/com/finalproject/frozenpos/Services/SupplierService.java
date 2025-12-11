package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SupplierDTO;
import com.finalproject.frozenpos.Entities.Supplier;
import com.finalproject.frozenpos.Repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    public Supplier findById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier save(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(dto.getSupplierName());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        return supplierRepository.save(supplier);
    }

    public Supplier update(Long id, SupplierDTO dto) {
        Optional<Supplier> optional = supplierRepository.findById(id);
        if (optional.isPresent()) {
            Supplier supplier = optional.get();
            supplier.setSupplierName(dto.getSupplierName());
            supplier.setPhoneNumber(dto.getPhoneNumber());
            supplier.setEmail(dto.getEmail());
            return supplierRepository.save(supplier);
        }
        return null;
    }

    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }
}
