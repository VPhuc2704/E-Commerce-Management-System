import { useState, useEffect } from "react";
import { API_BASE_URL } from "../constants/productConstants";

export const useProfileData = (user) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    bio: "",
    avatar: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Thử các endpoint có thể có
      const possibleEndpoints = [
        `${API_BASE_URL}/user/profile`,
        `${API_BASE_URL}/user/info`,
        `${API_BASE_URL}/user/me`,
        `${API_BASE_URL}/user`,
        `${API_BASE_URL}/user/details`
      ];

      let userData = null;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            userData = await response.json();
            console.log(`Success with endpoint: ${endpoint}`, userData);
            break;
          } else {
            console.log(`Failed endpoint: ${endpoint}, Status: ${response.status}`);
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(errorData.message || `Failed to fetch from ${endpoint}`);
          }
        } catch (error) {
          console.log(`Error with endpoint: ${endpoint}`, error.message);
          lastError = error;
          continue;
        }
      }

      if (!userData) {
        throw lastError || new Error('All user profile endpoints failed');
      }

      // Map response data to expected format
      return {
        name: userData.name || userData.fullName || userData.username || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || userData.phoneNumber || userData.mobile || "",
        address: userData.address || userData.location || "",
        bio: userData.bio || userData.description || userData.about || "",
        avatar: userData.avatar || userData.profileImage || userData.image || "",
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Thử các endpoint có thể có cho addresses
      const possibleEndpoints = [
        `${API_BASE_URL}/user/addresses`,
        `${API_BASE_URL}/user/address`,
        `${API_BASE_URL}/addresses`,
        `${API_BASE_URL}/user/shipping-addresses`
      ];

      let addressData = [];

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔍 Trying addresses endpoint: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            addressData = await response.json();
            console.log(`Success with addresses endpoint: ${endpoint}`, addressData);
            break;
          } else {
            console.log(`Failed addresses endpoint: ${endpoint}, Status: ${response.status}`);
          }
        } catch (error) {
          console.log(`Error with addresses endpoint: ${endpoint}`, error.message);
          continue;
        }
      }

      return Array.isArray(addressData) ? addressData : [];
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Starting to fetch profile data for user:', user);
        
        // Clear localStorage profile data để tránh cache cũ
        localStorage.removeItem('profileData');
        
        // Fetch user profile
        const userData = await fetchUserProfile();
        console.log('📋 Setting user info:', userData);
        setUserInfo(userData);
        
        // Fetch user addresses
        const addressData = await fetchUserAddresses();
        setAddresses(addressData);
        
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu hồ sơ:", error);
        
        // Đặt lại về dữ liệu trống khi có lỗi
        setUserInfo({
          name: "",
          email: user?.email || "",
          phone: "",
          address: "",
          bio: "",
          avatar: "",
        });
        setAddresses([]);
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
    addresses,
    setAddresses,
    isLoading,
    refetch: async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Refetching profile data...');
        
        const userData = await fetchUserProfile();
        setUserInfo(userData);
        
        const addressData = await fetchUserAddresses();
        setAddresses(addressData);
      } catch (error) {
        console.error('❌ Error refetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    }, // Thêm function để refetch data khi cần
  };
};