package org.javaweb.enums;

public enum roleCode {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER");
    private final String nameCode;

    roleCode(String nameCode) {
        this.nameCode = nameCode;
    }
    public String getNameCode() {
        return nameCode;
    }

}
