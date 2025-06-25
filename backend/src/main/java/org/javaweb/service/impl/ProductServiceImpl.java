package org.javaweb.service.impl;

import org.javaweb.converter.ProductConverter;
import org.javaweb.entity.CategoryEntity;
import org.javaweb.entity.ProductEntity;
import org.javaweb.model.dto.CatogeryDTO;
import org.javaweb.model.dto.ProductsDTO;
import org.javaweb.repository.CatogeryRepository;
import org.javaweb.repository.ProductRepository;
import org.javaweb.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService{
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CatogeryRepository  catogeryRepository;
    @Autowired
    private ProductConverter productConverter;


    @Override
    public List<ProductsDTO> getProductsByCategory(Long categoryId) {

        List<ProductEntity> products = productRepository.findByCategory_Id(categoryId);

//        List<ProductsDTO> listProductsDTO = new ArrayList<>();
//
//        for (ProductEntity product : products) {
//            ProductsDTO dto = productConverter.toDTO(product);
//            listProductsDTO.add(dto);
//        }
//        chuyen thu cong

//        Dung Stream API
        return products.stream().map(productConverter::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ProductsDTO> getProductsAll() {
        List<ProductEntity> listProducts = productRepository.findAll();
        return listProducts.stream().map(productConverter::toDTO).collect(Collectors.toList());
    }

    @Override
    public Optional<ProductsDTO> getProductById(Long productId) {
        Optional<ProductEntity> product =  productRepository.findById(productId);
        if (product.isPresent()){
            ProductEntity  productEntity = product.get();
            ProductsDTO productsDTO = productConverter.toDTO(productEntity);
            return Optional.of(productsDTO);
        }
        else {
            return Optional.empty();
        }
    }

    @Override
    @Transactional
    public Optional<ProductsDTO> updateProductById(Long productId,  ProductsDTO productsDTO) {
        Optional<ProductEntity> productEntity = productRepository.findById(productId);
        if (!productEntity.isPresent()){
            return Optional.empty();
        }
        ProductEntity product = productEntity.get();
        productConverter.updateProductEntity(productsDTO, product );
        productRepository.save(product);
        return Optional.ofNullable(productConverter.toDTO(product));
    }

    @Override
    @Transactional
    public Optional<ProductsDTO> addProduct(ProductsDTO productsDTO) {
        ProductEntity productEntity = productConverter.toEntity(productsDTO);
        productRepository.save(productEntity);
        return Optional.ofNullable(productConverter.toDTO(productEntity));
    }

    @Override
    @Transactional
    public void deteleProductById(Long productId) {
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);
        productRepository.delete(productEntity);
    }

    @Override
    public List<CatogeryDTO> getNameCategory() {
        List<CatogeryDTO> categoryNames = catogeryRepository.findAll()
                .stream()
                .map(category -> new CatogeryDTO(category.getId(), category.getName()))
                .collect(Collectors.toList());
        return categoryNames;
    }


}
