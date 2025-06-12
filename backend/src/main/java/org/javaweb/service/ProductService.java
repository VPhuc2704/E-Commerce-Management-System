package org.javaweb.service;

import org.javaweb.model.dto.CatogeryDTO;
import org.javaweb.model.dto.ProductsDTO;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

public interface ProductService {
    List<ProductsDTO> getProductsByCategory(Long categoryId);
    List<ProductsDTO> getProductsAll();
    Optional<ProductsDTO> getProductById(Long productId);
    Optional<ProductsDTO> updateProductById(Long productId, ProductsDTO productsDTO);
    Optional<ProductsDTO> addProduct(ProductsDTO productsDTO);
    void deteleProductById(Long productId);
    List<CatogeryDTO> getNameCategory();
}
