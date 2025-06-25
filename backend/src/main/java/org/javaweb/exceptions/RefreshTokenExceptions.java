package org.javaweb.exceptions;

public class RefreshTokenExceptions extends RuntimeException{
    public RefreshTokenExceptions(String message, String refreshtoken){
        super(String.format("Failed for [%s]: %s", refreshtoken, message));
    }
}
