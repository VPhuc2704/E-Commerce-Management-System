"use client";

import { useState } from "react";
import profileService from "../services/profileService";
import { useNotification } from "./useNotification";

export const useProfileForm = (initialUserInfo) => {
  const { showNotification } = useNotification();
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

  const handleSaveProfile = async (userInfo, setUserInfo) => {
    try {
      const updatedUser = await profileService.updateUserInfo(userInfo);
      setUserInfo(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setIsEditing(false);
      showNotification("Thông tin cá nhân đã được cập nhật!", "success");
    } catch (error) {
      showNotification("Cập nhật thông tin thất bại!", "error");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("Mật khẩu mới không khớp!", "error");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showNotification("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }
    try {
      await profileService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showNotification("Mật khẩu đã được cập nhật!", "success");
    } catch (error) {
      showNotification("Cập nhật mật khẩu thất bại!", "error");
    }
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