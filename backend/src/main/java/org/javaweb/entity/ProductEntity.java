package org.javaweb.entity;

import org.javaweb.enums.productStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="products")
public class ProductEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="price")
    private Double price;

    @Column(name="quantity")
    private Integer quantity;

    @Column(name="image")
    private String image;

    @Column(name="type")
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private productStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="category_id")
    private CategoryEntity category;

    @OneToMany(mappedBy = "products",  cascade = CascadeType.ALL)
    private List<OrderItemEntity> listOrderItem = new ArrayList<>();

    @OneToMany(mappedBy = "products")
    private List<CartItemEntity> listCartItems = new ArrayList<>();

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public productStatus getStatus() {
        return status;
    }

    public void setStatus(productStatus status) {
        this.status = status;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }

    public List<OrderItemEntity> getListOrderItem() {
        return listOrderItem;
    }

    public void setListOrderItem(List<OrderItemEntity> listOrderItem) {
        this.listOrderItem = listOrderItem;
    }

    public List<CartItemEntity> getListCartItems() {
        return listCartItems;
    }

    public void setListCartItems(List<CartItemEntity> listCartItems) {
        this.listCartItems = listCartItems;
    }
}
