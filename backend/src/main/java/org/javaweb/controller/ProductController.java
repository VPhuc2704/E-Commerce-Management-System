package org.javaweb.controller;

import org.javaweb.constant.ApiResponse;
import org.javaweb.model.dto.CatogeryDTO;
import org.javaweb.model.dto.ProductsDTO;
import org.javaweb.service.ProductService;
import org.javaweb.utils.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;


@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/api/products/category/{category_id}")
    public ResponseEntity<List<ProductsDTO>> getProductsByCategory(@PathVariable("category_id") Long categoryId){
        List<ProductsDTO> listProductsDTOS = productService.getProductsByCategory(categoryId);
        return new ResponseEntity<>(listProductsDTOS, HttpStatus.OK);
    }

    @GetMapping("/api/products/all")
    public ResponseEntity<List<ProductsDTO>> getProductsALL(){
        List<ProductsDTO> listProductsDTOS = productService.getProductsAll();
        return new ResponseEntity<>(listProductsDTOS, HttpStatus.OK);
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<?> getProductsById(@PathVariable("id") Long id){
        Optional<ProductsDTO> product = productService.getProductById(id);
        if (!product.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "Không tìm thấy sản phẩm", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy sản phẩm thành công", product));
    }

    @PutMapping("/api/admin/products/{id}")
    public ResponseEntity<?> updateProductsById(@PathVariable("id") Long id,
                                                          @RequestBody ProductsDTO productsDTO){
        Optional<ProductsDTO> products = productService.updateProductById(id, productsDTO);
        if (products.isPresent()) {
            return ResponseEntity.ok(
                    new ApiResponse<>(200, "Cập nhật sản phẩm thành công", products.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "Không tìm thấy sản phẩm cần cập nhật", null));
        }
    }

    @PostMapping("/api/admin/products")
    public ResponseEntity<?> createProducts(@RequestBody ProductsDTO productsDTO){
        Optional<ProductsDTO> products = productService.addProduct(productsDTO);
        if (products.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(201, "Thêm sản phẩm thành công", products));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(400, "Thêm sản phẩm thất bại", null));
        }
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<?> deleteProducts(@PathVariable Long id ){
        productService.deteleProductById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/api/categories/name")
    public ResponseEntity<List<CatogeryDTO>> getCategoryNames() {
        return ResponseEntity.ok(productService.getNameCategory());
    }
}
