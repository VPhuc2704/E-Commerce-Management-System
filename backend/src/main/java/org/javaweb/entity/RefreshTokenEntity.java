package org.javaweb.entity;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refreshtoken")
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name ="user_id", referencedColumnName = "id")
    private UserEntity user;

    @Column(name ="refreshtoken",nullable = false, unique = true, length = 200)
    private String refreshtoken;

    @Column(nullable = false, length = 200)
    private Instant expiryDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getRefreshtoken() {
        return refreshtoken;
    }

    public void setRefreshtoken(String refreshtoken) {
        this.refreshtoken = refreshtoken;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public RefreshTokenEntity(){

    }
//    public RefreshTokenEntity(String refreshtoken){
//        this.refreshtoken = refreshtoken;
//    }


    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }
}
