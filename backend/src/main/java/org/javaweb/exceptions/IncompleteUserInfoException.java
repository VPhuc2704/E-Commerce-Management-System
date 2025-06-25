package org.javaweb.exceptions;

public class IncompleteUserInfoException extends RuntimeException {
    public IncompleteUserInfoException(String message) {
        super(message);
    }
}
