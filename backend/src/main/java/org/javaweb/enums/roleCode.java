package org.javaweb.enums;

public enum RoleCode {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");
    private final String nameCode;

    RoleCode(String nameCode) {
        this.nameCode = nameCode;
    }
    public String getNameCode() {
        return nameCode;
    }

}
