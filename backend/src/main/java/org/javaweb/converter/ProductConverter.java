package org.javaweb.converter;

import org.javaweb.entity.ProductEntity;
import org.javaweb.model.dto.ProductsDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductConverter {
    @Autowired
    private ModelMapper modelMapper;

    public ProductsDTO toDTO(ProductEntity productEntity){
        return modelMapper.map(productEntity, ProductsDTO.class);
    }

    public ProductEntity toEntity(ProductsDTO productsDTO){
        return modelMapper.map(productsDTO, ProductEntity.class);
    }

    public void updateProductEntity(ProductsDTO productsDTO, ProductEntity productEntity){
        modelMapper.map(productsDTO, productEntity);
    }
}
