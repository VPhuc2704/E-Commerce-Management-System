package org.javaweb.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.javaweb.enums.RoleCode;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "role")
public class RoleEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "code", nullable = false, unique = true)
    private RoleCode code;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    @JsonBackReference
    private List<UserEntity> users = new ArrayList<>();

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

    public void setCode(RoleCode code) {
        this.code = code;
    }


    public RoleCode getCode() {
        return code;
    }

    public List<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(List<UserEntity> users) {
        this.users = users;
    }

    public RoleEntity() {
        // constructor mặc định, có thể để trống
    }

    public RoleEntity(RoleCode code) {
        this.code = code;
    }
}
