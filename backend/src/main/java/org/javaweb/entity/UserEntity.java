package org.javaweb.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "user")
public class UserEntity extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name ="email", unique=true, length=100)
    private String email;

    @Column(name ="password")
    @JsonIgnore
    private String password;

    @Column(name ="fullname")
    private String fullname;

    @Column(name = "numberphone", length = 10)
    private String numberphone;

    @Column(name = "address")
    private String address;

    @Column(name = "isverified", nullable = false)
    private Boolean isverified = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonBackReference
    @JoinTable(
            name = "user_role", // bảng trung gian
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false), // khóa ngoại tham chiếu từ User
            inverseJoinColumns = @JoinColumn(name ="role_id", referencedColumnName = "id", nullable = false)) // khóa ngoại đến Role
    private List<RoleEntity> roles = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "users", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CartEntity> listCart = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "users",  cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderEntity> listOrder = new ArrayList<>();

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getNumberphone() {
        return numberphone;
    }

    public void setNumberphone(String numberphone) {
        this.numberphone = numberphone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<RoleEntity> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleEntity> roles) {
        this.roles = roles;
    }

    public List<CartEntity> getListCart() {
        return listCart;
    }

    public void setListCart(List<CartEntity> listCart) {
        this.listCart = listCart;
    }

    public List<OrderEntity> getListOrder() {
        return listOrder;
    }

    public void setListOrder(List<OrderEntity> listOrder) {
        this.listOrder = listOrder;
    }

    public Boolean getIsverified() {
        return isverified;
    }

    public void setIsverified(Boolean isverified) {
        this.isverified = isverified;
    }

    public UserEntity(){}

    public UserEntity(Long id){
        this.id = id;
    }


}
