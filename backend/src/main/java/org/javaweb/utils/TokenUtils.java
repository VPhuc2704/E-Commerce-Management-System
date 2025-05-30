package org.javaweb.utils;

import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;


public class TokenUtils {
    public static String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
}
