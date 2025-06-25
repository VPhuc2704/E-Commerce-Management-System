"use client";

import { useState, useEffect, useCallback } from "react";
import profileService from "../services/profileService";
import { useNotification } from "./useNotification";

const useProfile = (user) => {
  const { notification, showNotification, hideNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    numberphone: "",
    address: "",
    bio: "",
    avatar: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const fetchData = useCallback(async () => {
    try {
      const savedUserInfo = localStorage.getItem("userInfo");
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
      }

      const userData = await profileService.getUserInfo(user);
      if (userData) {
        setUserInfo(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      showNotification("Lỗi khi tải dữ liệu!", "error");
    }
  }, [user, showNotification]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    try {
      const updatedUser = await profileService.updateUserInfo(userInfo);
      setUserInfo(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setIsEditing(false);
      showNotification("Thông tin cá nhân đã được cập nhật!", "success");
    } catch (error) {
      showNotification("Cập nhật thất bại!", "error");
    }
  }, [userInfo, showNotification]);

  const handleUpdatePassword = useCallback(async (e) => {
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
        confirmPassword: ""
      });
      showNotification("Mật khẩu đã được cập nhật!", "success");
    } catch (error) {
      showNotification("Cập nhật mật khẩu thất bại!", "error");
    }
  }, [passwordForm, showNotification]);

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    selectedOrder,
    setSelectedOrder,
    userInfo,
    setUserInfo,
    passwordForm,
    notification,
    showNotification,
    hideNotification,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleUpdatePassword
  };
};

export default useProfile;