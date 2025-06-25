package org.javaweb.entity;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification")
public class VerificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name ="user_id", referencedColumnName = "id")
    private UserEntity user;

    @Column(name ="verificationtoken",nullable = false, unique = true, length = 200)
    private String verificationtoken;

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

    public String getVerificationtoken() {
        return verificationtoken;
    }

    public void setVerificationtoken(String verificationtoken) {
        this.verificationtoken = verificationtoken;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }
}
