package org.javaweb.entity;

import javax.persistence.*;

@Entity
@Table(name = "shippinginfo")
public class ShippingInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
