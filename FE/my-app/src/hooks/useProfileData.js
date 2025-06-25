import { useState, useEffect } from "react";
import profileService from "../services/profileService";

export const useProfileData = (user) => {
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: user?.email || "",
    numberphone: "",
    address: "",
    bio: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
          setUserInfo(JSON.parse(savedUserInfo));
        }

        const userData = await profileService.getUserInfo(user);
        setUserInfo(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hồ sơ:", error);
        setUserInfo({
          fullname: "",
          email: user?.email || "",
          numberphone: "",
          address: "",
          bio: "",
          avatar: "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return {
    userInfo,
    setUserInfo,
    isLoading,
    refetch: async () => {
      try {
        setIsLoading(true);
        const userData = await profileService.getUserInfo(user);
        setUserInfo(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
      } catch (error) {
        console.error('Error refetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    },
  };
};