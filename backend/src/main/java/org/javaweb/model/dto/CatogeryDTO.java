package org.javaweb.model.dto;

public class CatogeryDTO {
    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public CatogeryDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
