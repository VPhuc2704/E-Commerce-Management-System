"use client";

import { useState } from "react";

export const useProfileForm = (initialUserInfo, showNotification) => {
  const [isEditing, setIsEditing] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    return { name, value };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (userInfo, setUserInfo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsEditing(false);
        setUserInfo(userInfo);
        showNotification("Thông tin cá nhân đã được cập nhật!", "success");
        resolve();
      }, 800);
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("Mật khẩu mới không khớp!", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showNotification("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }

    setTimeout(() => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showNotification("Mật khẩu đã được cập nhật!", "success");
    }, 800);
  };

  return {
    isEditing,
    setIsEditing,
    passwordForm,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleUpdatePassword,
  };
};