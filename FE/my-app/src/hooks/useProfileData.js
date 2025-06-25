"use client";

import { useState, useEffect } from "react";

export const useProfileData = (user) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    bio: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log("useProfileData useEffect triggered with user:", user);

    const fetchUserData = async () => {
      console.log("Starting to fetch user data...");
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (isMounted) {
          setUserInfo({
            name: "",
            email: user?.email || "",
            phone: "",
            avatar: "",
            bio: "",
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (isMounted) {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("isLoading set to false, current state:", { userInfo, addresses, isLoading });
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      console.log("useProfileData useEffect cleanup");
    };
  }, [user]);

  console.log("Returning useProfileData:", { userInfo, addresses, isLoading });
  return {
    userInfo,
    setUserInfo,
    addresses,
    setAddresses,
    isLoading,
  };
};