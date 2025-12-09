package com.finalproject.frozenpos.Services;

import com.finalproject.frozenpos.DTO.SupplierDTO;
import com.finalproject.frozenpos.Entities.Supplier;
import com.finalproject.frozenpos.Exception.ResourceNotFoundException;
import com.finalproject.frozenpos.Repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public List<Supplier> findAll() {
        return repository.findAll();
    }

    public Supplier findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier with id " + id + " not found"));
    }

    public Supplier save(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(dto.getSupplierName());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        return repository.save(supplier);
    }

    public Supplier update(Long id, SupplierDTO dto) {
        Supplier supplier = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier with id " + id + " not found"));

        supplier.setSupplierName(dto.getSupplierName());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        return repository.save(supplier);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
