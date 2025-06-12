package org.javaweb.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)   // defauld đã là fetch = FetchType.LAZY
    @JoinColumn(name = "user_id")
    private UserEntity users;

    @OneToMany(mappedBy = "carts", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CartItemEntity> listCartItems = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUsers() {
        return users;
    }

    public void setUsers(UserEntity users) {
        this.users = users;
    }

    public List<CartItemEntity> getListCartItems() {
        return listCartItems;
    }

    public void setListCartItems(List<CartItemEntity> listCartItems) {
        this.listCartItems = listCartItems;
    }
}
