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
            "/api/products/**",
            "/api/categories/name",
            "/api/cart/**",
            "/api/vnpayment/return",
            "/api/orders/**",
            "/img/*"

//            "/**" // Cho phép OPTIONS cho CORS
    };
    public static final String[] AUTHENTICATED_ENDPOINTS = {
            "/api/user/",
            "/api/user/**",
    };
    public static final String[] ADMIN_ENDPOINTS = {
            "/api/admin/products/**",
            "/api/orders/admin/status",
    };

}
