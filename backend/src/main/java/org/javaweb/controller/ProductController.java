package org.javaweb.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.javaweb.constant.ApiResponse;
import org.javaweb.model.dto.CatogeryDTO;
import org.javaweb.model.dto.ProductsDTO;
import org.javaweb.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


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
                                                @RequestPart(value = "productsDTO", required = false) String productsJson,
                                                @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            ProductsDTO productsDTO;

            if (productsJson != null) {
                productsDTO = new ObjectMapper().readValue(productsJson, ProductsDTO.class);
            } else {
                // Không có dữ liệu JSON → lấy sản phẩm từ DB để giữ lại thông tin cũ
                Optional<ProductsDTO> existing = productService.getProductById(id);
                if (!existing.isPresent()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse<>(404, "Không tìm thấy sản phẩm", null));
                }
                productsDTO = existing.get();
            }

            // Nếu có file ảnh thì xử lý lưu và cập nhật lại đường dẫn ảnh
            if (imageFile != null && !imageFile.isEmpty()) {
                String newFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                String uploadPath = System.getProperty("user.dir") + "/uploads/img/";
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                Path filePath = Paths.get(uploadPath, newFileName);
                try (InputStream is = imageFile.getInputStream()) {
                    Files.copy(is, filePath, StandardCopyOption.REPLACE_EXISTING);
                }

                productsDTO.setImage("/img/" + newFileName); // Giả sử frontend dùng đường dẫn này
            }

            Optional<ProductsDTO> updated = productService.updateProductById(id, productsDTO);
            if (updated.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(200, "Cập nhật sản phẩm thành công", updated.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(404, "Không tìm thấy sản phẩm để cập nhật", null));
            }

        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Lỗi định dạng JSON: " + e.getMessage(), null));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Lỗi xử lý file ảnh: " + e.getMessage(), null));
        }
    }


    @PostMapping("/api/admin/products")
    public ResponseEntity<?> createProducts(
                                            @RequestPart("productsDTO") String productsJson,
                                            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            ProductsDTO productsDTO = new ObjectMapper().readValue(productsJson, ProductsDTO.class);

            // xử lý ảnh nếu có
            if (imageFile != null && !imageFile.isEmpty()) {
                String uploadPath = System.getProperty("user.dir") + "/uploads/img/";
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                String originalFilename = imageFile.getOriginalFilename();
                String newFileName = UUID.randomUUID() + "_" + originalFilename;

                Path filePath = Paths.get(uploadPath, newFileName);
                try (InputStream is = imageFile.getInputStream()) {
                    Files.copy(is, filePath, StandardCopyOption.REPLACE_EXISTING);
                }
                productsDTO.setImage("/img/" + newFileName);
            }

            Optional<ProductsDTO> saved = productService.addProduct(productsDTO);
            if (saved.isPresent()) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(new ApiResponse<>(201, "Thêm sản phẩm thành công", saved.get()));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(400, "Thêm sản phẩm thất bại", null));
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(500, "Lỗi xử lý file ảnh", null));
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
