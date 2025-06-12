package org.javaweb.utils;

import org.javaweb.entity.UserEntity;
import org.javaweb.exceptions.IncompleteUserInfoException;

public class ValidateUserInfor {
    public static void validateUserInfo(UserEntity user) {
        if (user.getFullname() == null || user.getFullname().trim().isEmpty() ||
                user.getNumberphone() == null || user.getNumberphone().trim().isEmpty() ||
                user.getAddress() == null || user.getAddress().trim().isEmpty()) {
            throw new IncompleteUserInfoException("Vui lòng cập nhật đầy đủ thông tin cá nhân để đặt hàng");
        }
    }
}
