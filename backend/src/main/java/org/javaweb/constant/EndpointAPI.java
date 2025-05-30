package org.javaweb.constant;

public class EndpointAPI {

    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refreshtoken",
            "/api/auth/verify",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/auth/logout",
            "/**" // Cho phép OPTIONS cho CORS
    };

}
